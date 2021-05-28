import { Action, Created, Updated, Finished, Selected } from "./../types";
import {
  UPDATE_BOARD,
  CREATE_DRAW,
  UPDATE_DRAW,
  FINISH_DRAW,
  SELECT_DRAW,
  RECEIVE_UPDATE_DRAW,
  RECEIVE_SELECT_DRAW,
} from "./action-types";
import { DrawStatusEnums } from "../constants";

const { CREATED, UPDATED, FINISHED, SELECTED } = DrawStatusEnums;

function drawAction(
  type: string,
  status: Created | Updated | Finished | Selected = undefined
) {
  return (draw): Action => ({
    type,
    draw: status ? { ...draw, status } : draw,
  });
}

export const createDrawAction = drawAction(CREATE_DRAW, CREATED);

export const updateDrawAction = drawAction(UPDATE_DRAW, UPDATED);

export const finishDrawAction = drawAction(FINISH_DRAW, FINISHED);

export const selectDrawAction = drawAction(SELECT_DRAW, SELECTED);

// those actions below dispatch by socketIoMiddleware
export function updateBoard(drawings) {
  return {
    type: UPDATE_BOARD,
    drawings,
  };
}

export const receiveUpdateDraw = drawAction(RECEIVE_UPDATE_DRAW);
export const receiveSelectDraw = drawAction(RECEIVE_SELECT_DRAW);
