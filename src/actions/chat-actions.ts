import { Message, Action } from "../types";
import {
  BROADCAST_MESSAGE,
  MESSAGE_ROOM,
  MESSAGE_SELF,
  RECEIVE_BROADCAST_MESSAGE,
  RECEIVE_ROOM_MESSAGE,
  RECEIVE_SELF_MESSAGE,
} from "./action-types";

function receiveMessageAction(type: string) {
  return (message: Message): Action => {
    return {
      type,
      message,
    };
  };
}

export const broadcastMessageAction = receiveMessageAction(BROADCAST_MESSAGE);
export const messageRoomAction = receiveMessageAction(MESSAGE_ROOM);
export const messageSelfAction = receiveMessageAction(MESSAGE_SELF);

// those actions below dispatch by socketIoMiddleware
export const receiveBrocastMessageAction = receiveMessageAction(
  RECEIVE_BROADCAST_MESSAGE
);
export const receiveRoomMessageAction =
  receiveMessageAction(RECEIVE_ROOM_MESSAGE);
export const receiveSelfMessageAction =
  receiveMessageAction(RECEIVE_SELF_MESSAGE);
