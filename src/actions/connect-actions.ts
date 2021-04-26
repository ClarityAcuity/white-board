import {
  CONNECT,
  DISCONNECT,
  JOIN_ROOM,
  UPDATE_ROOM,
  Action,
  Emitter,
  Room,
  Message,
} from "./action-types";
import { Dispatch } from "redux";
import { socket } from "../socket";

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
