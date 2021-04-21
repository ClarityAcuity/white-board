import {
  createStore,
  applyMiddleware,
  Dispatch,
  AnyAction,
  Middleware,
} from "redux";
import reducer from "./redux/reducer";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { socket } from "../socket";

type AnyFunction = (...args: unknown[]) => unknown;
type Option = string | AnyFunction | Array<string>;

// events for registering
const events = [
  "UPDATE_BROADCAST_MESSAGE",
  "UPDATE_ROOM_MESSAGE",
  "UPDATE_SELF_MESSAGE",
  "UPDATE_ROOM",
];

function createSocketIoMiddleware(
  socket: SocketIOClient.Socket,
  criteria: Option = [],
  { execute = defaultExecute } = {}
): Middleware {
  const emitBound = socket.emit.bind(socket);

  return ({ dispatch, getState }) => {
    // Wire socket.io to dispatch actions sent by the server.
    events.forEach((event) =>
      socket.on(event, (data: Record<string, unknown>) => {
        dispatch({ ...data, type: event });
        return dispatch;
      })
    );
    return (next: Dispatch) => (action: AnyAction) => {
      console.log(evaluate(action, criteria), socket.connected);
      if (evaluate(action, criteria) && socket.connected) {
        return execute(action, emitBound, next, dispatch);
      }
      return next(action);
    };
  };

  function evaluate(action: AnyAction, option: Option): boolean {
    console.log(action);
    if (!action || !action.type) {
      return false;
    }

    const { type } = action;
    let matched = false;
    if (typeof option === "function") {
      // Test function
      matched = option(type, action) ? true : false;
    } else if (typeof option === "string") {
      // String prefix
      matched = type.indexOf(option) === 0;
    } else if (Array.isArray(option)) {
      // Array of types
      matched = option.some((item) => type.indexOf(item) === 0);
    }
    return matched;
  }
}

function defaultExecute(
  action: AnyAction,
  emit: (event: string, ...args: unknown[]) => SocketIOClient.Socket,
  next: Dispatch,
  dispatch: Dispatch
) {
  console.log(action);
  const { type } = action;
  if (type && socket.connected) {
    emit(type, action);
  }
  next(action);
}

const socketIoMiddleware = createSocketIoMiddleware(socket, "");

const middlewares = [thunkMiddleware, socketIoMiddleware];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

store.subscribe(() => {
  console.log("new state", store.getState());
});

export default store;
