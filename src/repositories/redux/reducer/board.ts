import {
  BROADCAST_MESSAGE,
  UPDATE_BROADCAST_MESSAGE,
  MESSAGE_ROOM,
  UPDATE_ROOM_MESSAGE,
  MESSAGE_SELF,
  UPDATE_SELF_MESSAGE,
  JOIN_ROOM,
  UPDATE_ROOM,
  CREATE_DRAW,
  UPDATE_DRAW,
  Action,
  Draw,
  LineDraw,
  RectDraw,
} from "../../../actions/action-types";

export type BoardState = {
  readonly messages: Array<string | undefined>;
  drawings: Array<LineDraw | RectDraw | Draw>;
};

const initialState = {
  messages: [],
  drawings: [
    {
      id: "1",
      type: "line",
      x1: 0,
      y1: 80,
      x2: 100,
      y2: 20,
    } as LineDraw,
    {
      id: "2",
      type: "rect",
      width: 100,
      height: 100,
      x: 120,
      y: 100,
    } as RectDraw,
  ],
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

    case CREATE_DRAW: {
      const { draw: newDraw } = action;

      return { ...state, drawings: [...state.drawings, newDraw] };
    }
    case UPDATE_DRAW: {
      const { draw: newDraw } = action;
      const { drawings } = state;
      let hasDraw;
      const updatedDrawings = drawings.map((draw) => {
        if (draw.id === newDraw.id) {
          hasDraw = true;
          return newDraw;
        }
        return draw;
      });

      return {
        ...state,
        drawings: hasDraw ? updatedDrawings : [...updatedDrawings, newDraw],
      };
    }

    default:
      return state;
  }
}
