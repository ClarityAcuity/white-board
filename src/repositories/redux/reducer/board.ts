import {
  BROADCAST_MESSAGE,
  RECEIVE_BROADCAST_MESSAGE,
  MESSAGE_ROOM,
  RECEIVE_ROOM_MESSAGE,
  MESSAGE_SELF,
  RECEIVE_SELF_MESSAGE,
  JOIN_ROOM,
  CREATE_DRAW,
  UPDATE_DRAW,
  FINISH_DRAW,
  RECEIVE_UPDATE_DRAW,
  DrawStatusEnums,
  Action,
  Draw,
  LineDraw,
  RectDraw,
} from "../../../actions/action-types";

export type BoardState = {
  readonly messages: Array<string | undefined>;
  drawings: Array<LineDraw | RectDraw | Draw>;
};

const { CREATED, FINISHED } = DrawStatusEnums;

const initialState = {
  messages: [],
  drawings: [
    {
      id: "1",
      type: "line",
      status: "finished",
      x1: 0,
      y1: 80,
      x2: 100,
      y2: 20,
    } as LineDraw,
    {
      id: "2",
      type: "rect",
      status: "finished",
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
    case RECEIVE_BROADCAST_MESSAGE:
    case RECEIVE_ROOM_MESSAGE:
    case RECEIVE_SELF_MESSAGE: {
      const { message } = action;

      return {
        ...state,
        messages: [...state.messages, message],
      };
    }

    case CREATE_DRAW: {
      const { draw: newDraw } = action;

      return {
        ...state,
        drawings: [...state.drawings, newDraw],
      };
    }
    case UPDATE_DRAW: {
      const { draw: newDraw } = action;
      const { drawings: prevDrawings } = state;
      const drawings = prevDrawings.map((draw) => {
        if (draw.id === newDraw.id && draw.status !== FINISHED) {
          return newDraw;
        }
        return draw;
      });

      return {
        ...state,
        drawings,
      };
    }
    case FINISH_DRAW: {
      const { draw: newDraw } = action;
      const { drawings: prevDrawings } = state;
      const drawings = prevDrawings.map((draw) => {
        if (draw.id === newDraw.id && draw.status !== newDraw.status) {
          return { ...newDraw };
        }
        return draw;
      });

      return {
        ...state,
        drawings,
      };
    }
    case RECEIVE_UPDATE_DRAW: {
      const { draw: newDraw } = action;
      const { drawings } = state;
      const updatedDrawings = drawings.map((draw) => {
        if (draw.id === newDraw.id && draw.status !== FINISHED) {
          return newDraw;
        }
        return draw;
      });

      return {
        ...state,
        drawings: newDraw.status !== CREATED ? updatedDrawings : [...drawings, newDraw],
      };
    }

    default:
      return state;
  }
}
