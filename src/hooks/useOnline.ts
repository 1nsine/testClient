import { useEffect, useState } from "react";
import { socket } from "../Config/socket";

export const useOnline = () => {
  const [online, setOnline] = useState<number>(0);

  useEffect(() => {
    const handleOnlineUpdate = (data: { total: number }) => {
      setOnline(data.total);
    };

    socket.on("online:update", handleOnlineUpdate);

    return () => {
      socket.off("online:update", handleOnlineUpdate);
    };
  }, []);

  return online;
};
