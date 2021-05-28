import { Dispatch } from "redux";
import { RootState } from "../repositories/redux/reducer";

export type Message = string;
export type Room = string;
export type GetState = () => RootState;
export type Emitter = (dispatch: Dispatch, getState: GetState) => void;

export type Select = "select";
export type Line = "line";
export type Rect = "rect";
export type Mode = Select | Line | Rect;
export type Created = "created";
export type Updated = "updated";
export type Finished = "finished";
export type Selected = "selected";
export interface Draw {
  id: string;
  type: Line | Rect;
  status: Created | Updated | Finished;
}
export interface LineDraw extends Draw {
  type: Line;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
export interface RectDraw extends Draw {
  type: Rect;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Action = {
  type: string;
  message?: Message;
  room?: Room;
  drawings?: Array<LineDraw | RectDraw>;
  draw?: LineDraw | RectDraw;
};
