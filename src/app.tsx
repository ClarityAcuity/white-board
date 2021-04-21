import React, { useState, useEffect, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startConnect,
  closeConnect,
  messageRoomAction,
  joinRoomAction,
} from "./actions";
import { RootState } from "./repositories/redux/reducer";
import { BoardState } from "./repositories/redux/reducer/board";
import { ConnectionState } from "./repositories/redux/reducer/connection";

function Board(): ReactElement {
  const [input, setInput] = useState("");
  const boardReducer = useSelector<RootState, BoardState>(
    (state) => state.boardReducer
  );
  const connectionReducer = useSelector<RootState, ConnectionState>(
    (state) => state.connectionReducer
  );
  const { messages } = boardReducer;
  const { room } = connectionReducer;
  console.log(boardReducer, messages);
  const dispatch = useDispatch();

  useEffect(() => {
    joinRoomAction("room1");
  }, []);

  const _handleConnect = (e: React.MouseEvent) => {
    console.log("start");
    e.preventDefault();
    dispatch(startConnect());
  };

  const _handleDisconnect = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(closeConnect());
  };

  const _handleChangeRoom = (e: React.ChangeEvent) => {
    const { value } = e.target as HTMLSelectElement;
    if (value) {
      console.log(value);
      dispatch(joinRoomAction(value));
    }
  };

  const _handleSendMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(messageRoomAction(input));
  };

  return (
    <>
      <div>
        <button onClick={_handleConnect}>Connect</button>
        <button onClick={_handleDisconnect}>Disconnect</button>
        <select value={room} onChange={_handleChangeRoom}>
          <option value={"room1"}>room1</option>
          <option value={"room2"}>room2</option>
        </select>
      </div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={_handleSendMessage}>Room</button>
      </div>
    </>
  );
}

export default Board;
