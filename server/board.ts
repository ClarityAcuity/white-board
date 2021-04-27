import { v4 } from "uuid";
import { Socket, Server } from "socket.io";
import {
  JOIN_ROOM,
  UPDATE_ROOM,
  BROADCAST_MESSAGE,
  RECEIVE_BROADCAST_MESSAGE,
  MESSAGE_ROOM,
  RECEIVE_ROOM_MESSAGE,
  MESSAGE_SELF,
  RECEIVE_SELF_MESSAGE,
  CREATE_DRAW,
  UPDATE_DRAW,
  FINISH_DRAW,
  RECEIVE_UPDATE_DRAW,
} from "../src/actions/action-types";

type Message = string;
type Id = string;
type Room = string;

const users = new Map();

function broadcast(ws: Socket, message: Message, userId: Id): void {
  if (!message) return;

  console.log("broadcast:", message);
  ws.broadcast.emit(RECEIVE_BROADCAST_MESSAGE, { message, userId });
}

function whichRoom(ws: Socket): Room {
  return (
    Array.from(ws.rooms).find((room) => {
      return room !== ws.id;
    }) || "Not in room"
  );
}

function leftRoomMessage(ws: Socket, room: Room, userId: Id): void {
  const message = `${userId} has left ${room}`;

  ws.to(room).emit(RECEIVE_ROOM_MESSAGE, { message, userId });
}

const updateDraw = (ws: Socket, userId: Id) => (action): void => {
  const { type, draw } = action;
  const inRoom = whichRoom(ws);
  const message = `> ${userId}: ${type} ${draw.type} ${draw.id}`;

  console.log("message:", message, draw);
  ws.emit(RECEIVE_SELF_MESSAGE, { message });
  ws.to(inRoom).emit(RECEIVE_UPDATE_DRAW, { draw });
};

export function board(ws: Socket, io: Server): void {
  const userId = v4();

  // Register user connection
  users.set("userId", userId);
  console.log("user", users, ws.rooms);
  broadcast(ws, `> User with the id ${userId} is connected`, userId);

  ws.on(JOIN_ROOM, (action) => {
    const inRoom = whichRoom(ws);
    if (inRoom) {
      ws.leave(inRoom);
      leftRoomMessage(ws, inRoom, userId);
    }

    const { room } = action;
    const message = `!! ${userId} id added to ${room}`;

    ws.join(room);
    io.in(room).emit(UPDATE_ROOM, { room })
    io.in(room).emit(RECEIVE_ROOM_MESSAGE, { message, userId });
  });

  ws.on(BROADCAST_MESSAGE, (action) => {
    const { message: msg } = action;
    const message = typeof msg === "string" ? msg : "";

    broadcast(ws, `> ${userId}: ${message}`, userId);
  });

  ws.on(MESSAGE_ROOM, (action) => {
    const { message: msg } = action;
    const inRoom = whichRoom(ws);
    const message = `> ${inRoom}/${userId}: ${
      typeof msg === "string" ? msg : ""
    }`;
    console.log("message:", message);
    ws.to(inRoom).emit(RECEIVE_ROOM_MESSAGE, { message, userId });
  });

  ws.on(MESSAGE_SELF, (action) => {
    const { message: msg } = action;
    const message = `> ${userId}: ${typeof msg === "string" ? msg : ""}`;

    console.log("message:", message);
    ws.emit(RECEIVE_SELF_MESSAGE, { message });
  });

  ws.on(CREATE_DRAW, updateDraw(ws, userId));

  ws.on(UPDATE_DRAW, updateDraw(ws, userId));

  ws.on(FINISH_DRAW, updateDraw(ws, userId));

  //A special namespace "disconnect" for when a client disconnects
  ws.on("disconnect", (reason) => {
    console.log(`${userId}: ${reason}`);
    // Unregister user conection
    users.delete(userId);
    broadcast(ws, `> User with the id ${userId} is disconnected`, userId);
  });
}
