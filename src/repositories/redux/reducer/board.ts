import { Action, Draw, LineDraw, RectDraw } from "../../../types";
import {
  BROADCAST_MESSAGE,
  RECEIVE_BROADCAST_MESSAGE,
  MESSAGE_ROOM,
  RECEIVE_ROOM_MESSAGE,
  MESSAGE_SELF,
  RECEIVE_SELF_MESSAGE,
  JOIN_ROOM,
  UPDATE_BOARD,
  CREATE_DRAW,
  UPDATE_DRAW,
  FINISH_DRAW,
  SELECT_DRAW,
  RECEIVE_UPDATE_DRAW,
  RECEIVE_SELECT_DRAW,
} from "../../../actions/action-types";
import { DrawStatusEnums } from "../../../constants";

export type BoardState = {
  readonly messages: Array<string | undefined>;
  selectedDraw: LineDraw | RectDraw | Draw;
  drawings: Array<LineDraw | RectDraw | Draw>;
};

const { CREATED, FINISHED } = DrawStatusEnums;

const initialState = {
  messages: [],
  selectedDraw: null,
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
    case UPDATE_BOARD: {
      const { drawings } = action;

      return { ...state, drawings };
    }
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
      const { draw: selectedDraw } = action;

      return {
        ...state,
        drawings: [...state.drawings, selectedDraw],
      };
    }
    case UPDATE_DRAW: {
      const { draw: selectedDraw } = action;
      const { drawings: prevDrawings } = state;
      const drawings = prevDrawings.map((draw) => {
        if (draw.id === selectedDraw.id && draw.status !== FINISHED) {
          return selectedDraw;
        }
        return draw;
      });

      return {
        ...state,
        selectedDraw,
        drawings,
      };
    }
    case FINISH_DRAW: {
      const { draw: selectedDraw } = action;
      const { drawings: prevDrawings } = state;
      const drawings = prevDrawings.map((draw) => {
        if (
          draw.id === selectedDraw.id &&
          draw.status !== selectedDraw.status
        ) {
          return { ...selectedDraw };
        }
        return draw;
      });

      return {
        ...state,
        drawings,
      };
    }
    case RECEIVE_UPDATE_DRAW: {
      const { draw: selectedDraw } = action;
      const { drawings } = state;
      const updatedDrawings = drawings.map((draw) => {
        if (draw.id === selectedDraw.id && draw.status !== FINISHED) {
          return selectedDraw;
        }
        return draw;
      });

      return {
        ...state,
        selectedDraw,
        drawings:
          selectedDraw.status !== CREATED
            ? updatedDrawings
            : [...drawings, selectedDraw],
      };
    }
    case SELECT_DRAW:
    case RECEIVE_SELECT_DRAW: {
      const { draw: selectedDraw } = action;
      const { drawings } = state;
      const updatedDrawings = drawings.map((draw) => {
        if (draw.id === selectedDraw.id) {
          return selectedDraw;
        }
        return { ...draw, status: FINISHED };
      });

      return {
        ...state,
        selectedDraw,
        drawings: updatedDrawings,
      };
    }

    default:
      return state;
  }
}
