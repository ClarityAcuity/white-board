import { CREATE_DRAW, UPDATE_DRAW } from "./action-types";

export function createDraw(draw) {
  return {
    type: CREATE_DRAW,
    draw,
  };
}

export function updateDraw(draw) {
  return {
    type: UPDATE_DRAW,
    draw,
  }
}
