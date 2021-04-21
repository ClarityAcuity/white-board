import { CONNECT, DISCONNECT, JOIN_ROOM, Action, Room } from "../../../actions";

export type ConnectionState = {
  readonly connection: boolean;
  room: Room;
};

const initialState = {
  connection: false,
  room: "room1",
};

export default function connectionReducer(
  state: ConnectionState = initialState,
  action: Action
): ConnectionState {
  switch (action.type) {
    case CONNECT:
      return { ...state, connection: true };
    case DISCONNECT:
      return { ...state, connection: false };
    case JOIN_ROOM:
      return { ...state, room: action.room };
    default:
      return state;
  }
}
