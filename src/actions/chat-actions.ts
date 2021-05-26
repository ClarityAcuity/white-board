import { Message, Action } from "../types";
import { BROADCAST_MESSAGE, MESSAGE_ROOM, MESSAGE_SELF } from "./action-types";

export function broadcastMessageAction(message: Message): Action {
  return {
    type: BROADCAST_MESSAGE,
    message,
  };
}

export function messageRoomAction(message: Message): Action {
  return {
    type: MESSAGE_ROOM,
    message,
  };
}

export function messageSelfAction(message: Message): Action {
  return {
    type: MESSAGE_SELF,
    message,
  };
}
