import { combineReducers } from "redux";
import boardReducer from "./board";
import connectionReducer from "./connection";

const rootReducer = combineReducers({
  boardReducer,
  connectionReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
