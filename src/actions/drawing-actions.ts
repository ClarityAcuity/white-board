import {
  CREATE_DRAW,
  UPDATE_DRAW,
  FINISH_DRAW,
  DrawStatusEnums,
} from "./action-types";

const { CREATED, UPDATED, FINISHED } = DrawStatusEnums;

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
