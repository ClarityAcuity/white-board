import io from "socket.io-client";

export const WS_BASE = "http://localhost:3000";

export const wsConfig = {
  autoConnect: false,
  reconnect: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
};

export const socket = io(WS_BASE, wsConfig);
