import {
  BROADCAST_MESSAGE,
  UPDATE_BROADCAST_MESSAGE,
  MESSAGE_ROOM,
  UPDATE_ROOM_MESSAGE,
  MESSAGE_SELF,
  UPDATE_SELF_MESSAGE,
  Message,
  Action,
} from "./action-types";

export function broadcastMessageAction(message: Message): Action {
  return {
    type: BROADCAST_MESSAGE,
    message,
  };
}

export function updateBroadcastMessageAction(message: Message): Action {
  return {
    type: UPDATE_BROADCAST_MESSAGE,
    message,
  };
}

export function messageRoomAction(message: Message): Action {
  return {
    type: MESSAGE_ROOM,
    message,
  };
}

export function updateRoomMessageAction(message: Message): Action {
  return {
    type: UPDATE_ROOM_MESSAGE,
    message,
  };
}

export function messageSelfAction(message: Message): Action {
  return {
    type: MESSAGE_SELF,
    message,
  };
}

export function updateSelfMessageAction(message: Message): Action {
  return {
    type: UPDATE_SELF_MESSAGE,
    message,
  };
}
