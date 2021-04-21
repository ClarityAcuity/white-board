import { socket } from "../socket";
import { Dispatch } from "redux";
import { RootState } from "../repositories/redux/reducer";

export const CONNECT = "CONNECT";
export const DISCONNECT = "DISCONNECT";
export const BROADCAST_MESSAGE = "BROADCAST_MESSAGE";
export const UPDATE_BROADCAST_MESSAGE = "UPDATE_BROADCAST_MESSAGE";
export const MESSAGE_ROOM = "MESSAGE_ROOM";
export const UPDATE_ROOM_MESSAGE = "UPDATE_ROOM_MESSAGE";
export const MESSAGE_SELF = "MESSAGE_SELF";
export const UPDATE_SELF_MESSAGE = "UPDATE_SELF_MESSAGE";
export const JOIN_ROOM = "JOIN_ROOM";
export const UPDATE_ROOM = "UPDATE_ROOM";

export type Message = string;
export type Room = string;
export type Action = {
  type: string;
  message?: Message;
  room?: Room;
};
type GetState = () => RootState;
type Emitter = (dispatch: Dispatch, getState: GetState) => void;

export function connectAction(): Action {
  return {
    type: CONNECT,
  };
}

export function startConnect(): Emitter {
  return (dispatch, getState) => {
    const {
      connectionReducer: { connection },
    } = getState();

    if (!connection) {
      dispatch(connectAction());
      socket.open();
    }
  };
}

export function disconnectAction(): Action {
  return {
    type: DISCONNECT,
  };
}

export function closeConnect(): Emitter {
  return (dispatch: Dispatch, getState): void => {
    const {
      connectionReducer: { connection },
    } = getState();

    if (connection) {
      dispatch(disconnectAction());
      socket.close();
    }
  };
}

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

export function joinRoomAction(room: Room): Action {
  return {
    type: JOIN_ROOM,
    room,
  };
}

export function updateRoom(message: Message): Action {
  return {
    type: UPDATE_ROOM,
    message,
  };
}
