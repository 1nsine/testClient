import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { socket } from "../src/Config/socket";
import type { Notification } from "../src/types/types";

type RealtimeContextType = {
  notifications: Notification[];
  unreadCount: number;
  onlineCount: number;
  getNotifications: () => void;
  markAllRead: () => void;
  emit: (event: string, data?: unknown) => void;
};

type RealtimeProviderProps = {
  userId: number | null;
  guestId: string | null;
  children: ReactNode;
};

type UnreadPayload = {
  unread: number;
};

type OnlinePayload = {
  total: number;
};

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export const RealtimeProvider = ({
  userId,
  guestId,
  children,
}: RealtimeProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!userId && !guestId) return;

    const handleNotificationsList = (data: Notification[]) => {
      setNotifications(data);
      setUnreadCount(data.filter((notification) => !notification.isRead).length);
    };

    const handleNotificationNew = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleNotificationsCount = ({ unread }: UnreadPayload) => {
      setUnreadCount(unread);
    };

    const handleOnlineUpdate = ({ total }: OnlinePayload) => {
      setOnlineCount(total);
    };

    socket.auth = {
      userId,
      guestId,
    };
    socket.connect();

    socket.on("notifications:list", handleNotificationsList);
    socket.on("notification:new", handleNotificationNew);
    socket.on("notifications:count", handleNotificationsCount);
    socket.on("online:update", handleOnlineUpdate);

    socket.emit("notifications:get");

    return () => {
      socket.off("notifications:list", handleNotificationsList);
      socket.off("notification:new", handleNotificationNew);
      socket.off("notifications:count", handleNotificationsCount);
      socket.off("online:update", handleOnlineUpdate);
      socket.disconnect();
    };
  }, [guestId, userId]);

  const getNotifications = useCallback(() => {
    socket.emit("notifications:get");
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
    setUnreadCount(0);
    socket.emit("notifications:read_all");
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    socket.emit(event, data);
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        notifications,
        unreadCount,
        onlineCount,
        getNotifications,
        markAllRead,
        emit,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);

  if (!context) {
    throw new Error("useRealtime must be used inside provider");
  }

  return context;
};
