import { useEffect } from "react";
import { toast } from "react-toastify";
import { socket } from "../Config/socket";
import type { Notification } from "../types/types";

export function useNotifications() {
  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      toast(notification.message);
    };

    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
    };
  }, []);
}
