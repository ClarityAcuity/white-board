import {
  CREATE_DRAW,
  UPDATE_DRAW,
  FINISH_DRAW,
  SELECT_DRAW,
} from "./action-types";
import { DrawStatusEnums } from "../constants";

const { CREATED, UPDATED, FINISHED, SELECTED } = DrawStatusEnums;

export function createDraw({ id, type, status = CREATED }) {
  const draw = { id, type, status };

  return {
    type: CREATE_DRAW,
    draw,
  };
}

export function updateDraw({ id, type, status = UPDATED, ...drawing }) {
  const draw = { id, type, status, ...drawing };

  return {
    type: UPDATE_DRAW,
    draw,
  };
}

export function finishDraw({ id, type, status = FINISHED, ...drawing }) {
  const draw = { id, type, status, ...drawing };

  return {
    type: FINISH_DRAW,
    draw,
  };
}

export function selectDraw({ id, type, ...drawing }) {
  const draw = { id, type, ...drawing, status: SELECTED };

  return {
    type: SELECT_DRAW,
    draw,
  };
}
