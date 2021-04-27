import { Dispatch } from "redux";
import { RootState } from "../repositories/redux/reducer";

export type Message = string;
export type Room = string;
export type GetState = () => RootState;
export type Emitter = (dispatch: Dispatch, getState: GetState) => void;

export type Line = "line";
export type Rect = "rect";
export type Mode = Line | Rect;
export type CREATED = "created"
export type UPDATED = "updated"
export type FINISHED = "finished"
export interface Draw {
  id: string;
  type: Line | Rect;
  status: CREATED | UPDATED | FINISHED
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
  draw?: LineDraw | RectDraw;
};

export const CONNECT = "CONNECT";
export const DISCONNECT = "DISCONNECT";

export const BROADCAST_MESSAGE = "BROADCAST_MESSAGE";
export const RECEIVE_BROADCAST_MESSAGE = "RECEIVE_BROADCAST_MESSAGE";
export const MESSAGE_ROOM = "MESSAGE_ROOM";
export const RECEIVE_ROOM_MESSAGE = "RECEIVE_ROOM_MESSAGE";
export const MESSAGE_SELF = "MESSAGE_SELF";
export const RECEIVE_SELF_MESSAGE = "RECEIVE_SELF_MESSAGE";
export const JOIN_ROOM = "JOIN_ROOM";
export const UPDATE_ROOM = "UPDATE_ROOM";

export const CREATE_DRAW = "CREATE_DRAW";
export const UPDATE_DRAW = "UPDATE_DRAW";
export const FINISH_DRAW = "FINISH_DRAW";
export const RECEIVE_UPDATE_DRAW = "RECEIVE_UPDATE_DRAW";

export const DrawStatusEnums = {
  CREATED: "created" as CREATED,
  UPDATED: "updated" as UPDATED,
  FINISHED: "finished" as FINISHED,
}
