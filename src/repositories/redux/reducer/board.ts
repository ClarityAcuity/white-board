import {
  BROADCAST_MESSAGE,
  UPDATE_BROADCAST_MESSAGE,
  MESSAGE_ROOM,
  UPDATE_ROOM_MESSAGE,
  MESSAGE_SELF,
  UPDATE_SELF_MESSAGE,
  JOIN_ROOM,
  UPDATE_ROOM,
  Action,
} from "../../../actions";

export type BoardState = {
  readonly messages: Array<string | undefined>;
};

const initialState = {
  messages: [],
};

export default function boardReducer(
  state: BoardState = initialState,
  action: Action
): BoardState {
  switch (action.type) {
    case BROADCAST_MESSAGE:
    case MESSAGE_ROOM:
    case MESSAGE_SELF:
    case JOIN_ROOM:
      return state;
    case UPDATE_BROADCAST_MESSAGE:
    case UPDATE_ROOM_MESSAGE:
    case UPDATE_SELF_MESSAGE:
    case UPDATE_ROOM: {
      const { message } = action;

      return {
        ...state,
        messages: [...state.messages, message],
      };
    }
    default:
      return state;
  }
}
