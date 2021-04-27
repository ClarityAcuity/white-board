import {
  CONNECT,
  DISCONNECT,
  UPDATE_ROOM,
  Action,
  Room,
} from "../../../actions/action-types";

export type ConnectionState = {
  readonly connection: boolean;
  room: Room;
};

const initialState = {
  connection: false,
  room: "",
};

export default function connectionReducer(
  state: ConnectionState = initialState,
  action: Action
): ConnectionState {
  switch (action.type) {
    case CONNECT:
      return { ...state, connection: true };
    case DISCONNECT:
      return { ...state, connection: false, room: "" };
    case UPDATE_ROOM:
      return { ...state, room: action.room };

    default:
      return state;
  }
}
