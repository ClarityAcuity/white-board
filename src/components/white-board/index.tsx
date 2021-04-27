import React, { useState, useEffect, useCallback, ReactElement } from "react";
import { useDispatch } from "react-redux";
import { throttle } from "lodash";
import Menu from "../menu";
import useScratch, {
  ScratchSensorParams,
  ScratchSensorState,
} from "../../hooks/use-scratch";
import {
  DrawStatusEnums,
  Mode,
  Draw,
  LineDraw,
  RectDraw,
} from "../../actions/action-types";
import { drawActions } from "../../actions";

const { createDraw, updateDraw, finishDraw } = drawActions;
const { CREATED } = DrawStatusEnums;

interface WhiteBoard {
  width: number;
  height: number;
  drawings: Array<LineDraw | RectDraw | Draw>;
}

const WhiteBoard = ({ width, height, drawings }: WhiteBoard): ReactElement => {
  const params: ScratchSensorParams = {
    disabled: false,
    onScratch: () => {}, // Don't want to dispatch action in setState
    onScratchStart: (state: ScratchSensorState) => {
      _createDrawing(state);
    },
    onScratchEnd: (state: ScratchSensorState) => {
      _finishDrawing(state);
    },
  };
  const [mode, setMode] = useState<Mode>();
  const [ref, state] = useScratch(params);
  const { dx, dy, x, y } = state;
  const dispatch = useDispatch();

  const onUpdateDrawing = useCallback(
    throttle((state: ScratchSensorState) => {
      _updateDrawing(state);
    }, 100),
    [drawings.length]
  );

  useEffect(() => {
    onUpdateDrawing(state);
  }, [state]);

  function _createDrawing(state) {
    const nextId = drawings.length + 1 + "";
    _nextLineDrawing(nextId, createDraw, state);
    _nextRectDrawing(nextId, createDraw, state);
  }

  function _updateDrawing(state) {
    const id = drawings.length + "";
    _nextLineDrawing(id, updateDraw, state);
    _nextRectDrawing(id, updateDraw, state);
  }

  function _finishDrawing(state) {
    const id = drawings.length + "";
    _nextLineDrawing(id, finishDraw, state);
    _nextRectDrawing(id, finishDraw, state);
  }

  function _nextLineDrawing(id, action, state) {
    if (mode === "line") {
      const nextDrawing = {
        id,
        type: mode,
        x1: state.x,
        y1: state.y,
        x2: state.x + state.dx,
        y2: state.y + state.dy,
      };
      dispatch(action(nextDrawing));
    }
  }

  function _nextRectDrawing(id, action, state) {
    if (mode === "rect") {
      const nextDrawing = {
        id,
        type: mode,
        width: Math.abs(state.dx),
        height: Math.abs(state.dy),
        x: state.dx >= 0 ? state.x : state.x + state.dx,
        y: state.dy >= 0 ? state.y : state.y + state.dy,
      };
      dispatch(action(nextDrawing));
    }
  }

  function _drawLine(line) {
    const { id, x1, y1, x2, y2 } = line;
    return <line key={id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />;
  }

  function _drawRect(rect) {
    const { id, x, y, width, height } = rect;
    return (
      <rect
        key={id}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="black"
        fill="azure"
      />
    );
  }

  function _renderDrawings() {
    return drawings.map((draw) => {
      const { type, status } = draw;
      const hasShape = status !== CREATED;
      if (!hasShape) {
        return null;
      }
      if (type === "line") {
        return _drawLine(draw);
      }
      if (type === "rect") {
        return _drawRect(draw);
      }
    });
  }

  return (
    <div>
      <div>WhiteBoard</div>
      <Menu mode={mode} onChange={setMode} />
      <p>{`x: ${x}, y: ${y}, dx: ${dx}, dy: ${dy}`}</p>
      <div style={{ height, width, border: "1px solid blue" }}>
        <svg ref={ref} viewBox={`0 0 ${width} ${height}`}>
          {_renderDrawings()}
        </svg>
      </div>
    </div>
  );
};

export default WhiteBoard;
