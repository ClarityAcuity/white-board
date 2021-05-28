import { Action, Emitter, Room } from "../types";
import { CONNECT, DISCONNECT, JOIN_ROOM, UPDATE_ROOM } from "./action-types";
import { Dispatch } from "redux";
import { socket } from "../socket";

export function connectAction(): Action {
  return {
    type: CONNECT,
  };
}

export function startConnectAction(): Emitter {
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

export function closeConnectAction(): Emitter {
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

function changeRoomAction(type: string) {
  return (room: Room): Action => ({
    type,
    room,
  });
}

export const joinRoomAction = changeRoomAction(JOIN_ROOM);

// those actions below dispatch by socketIoMiddleware
export const updateRoomAction = changeRoomAction(UPDATE_ROOM);
