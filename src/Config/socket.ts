import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { env } from "./env";

const user = JSON.parse(localStorage.getItem("user") || "null");

export const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");

  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem("guestId", guestId);
  }

  return guestId;
};

export const socket = io(env.socketBaseUrl, {
  autoConnect: false,
  auth: {
    userId: user?.id || null,
    guestId: user?.id ? null : getGuestId(),
  },
});
