import {
  Select,
  Line,
  Rect,
  Created,
  Updated,
  Finished,
  Selected,
} from "../types";

export const ModeEnums = {
  SELECT: "select" as Select,
  LINE: "line" as Line,
  RECT: "rect" as Rect,
};

export const DrawStatusEnums = {
  CREATED: "created" as Created,
  UPDATED: "updated" as Updated,
  FINISHED: "finished" as Finished,
  SELECTED: "selected" as Selected,
};
