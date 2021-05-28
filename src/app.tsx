import React, { useState, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { connectActions, chatActions } from "./actions";
import { RootState } from "./repositories/redux/reducer";
import { BoardState } from "./repositories/redux/reducer/board";
import { ConnectionState } from "./repositories/redux/reducer/connection";
import WhiteBoard from "./components/white-board";
import styles from "./app.module.css";

const { startConnectAction, closeConnectAction, joinRoomAction } =
  connectActions;
const { messageRoomAction } = chatActions;

function App(): ReactElement {
  const [input, setInput] = useState("");
  const boardReducer = useSelector<RootState, BoardState>(
    (state) => state.boardReducer
  );
  const connectionReducer = useSelector<RootState, ConnectionState>(
    (state) => state.connectionReducer
  );
  const { messages, selectedDraw, drawings } = boardReducer;
  const { connection, room } = connectionReducer;
  const dispatch = useDispatch();

  const _handleConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(startConnectAction());
  };

  const _handleDisconnect = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(closeConnectAction());
  };

  const _handleChangeRoom = (e: React.ChangeEvent) => {
    const { value } = e.target as HTMLSelectElement;
    if (value) {
      dispatch(joinRoomAction(value));
    }
  };

  const _handleSendMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(messageRoomAction(input));
  };

  return (
    <>
      <div className={styles.connection}>
        <button onClick={_handleConnect}>Connect</button>
        <button onClick={_handleDisconnect}>Disconnect</button>
        <select value={room} onChange={_handleChangeRoom}>
          {room === "" && <option value="">none</option>}
          <option value="room1">room1</option>
          <option value="room2">room2</option>
        </select>
        <div>{`isConnection: ${connection}${
          room !== "" ? `, ${room}` : ""
        }`}</div>
      </div>
      <WhiteBoard
        width={500}
        height={500}
        selectedDraw={selectedDraw}
        drawings={drawings}
      />
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

export default App;
