import React, { useState, useEffect, ReactElement } from "react";
import { useDispatch } from "react-redux";
import Menu from "../menu";
import usePrevios from "../../hooks/use-previous";
import useScratch, {
  ScratchSensorParams,
  ScratchSensorState,
} from "../../hooks/use-scratch";
import {
  Mode,
  Draw,
  LineDraw,
  RectDraw,
} from "../../actions/action-types";
import { drawActions } from "../../actions";

const { createDraw, updateDraw } = drawActions;
type WhiteBoard = {
  width: number;
  height: number;
  drawings: Array<LineDraw|RectDraw|Draw>
};
const WhiteBoard = ({ width, height, drawings }: WhiteBoard): ReactElement => {
  const params: ScratchSensorParams = {
    disabled: false,
    onScratch,
    onScratchStart: (state: ScratchSensorState) => {},
    onScratchEnd: (state: ScratchSensorState) => {},
  };
  const [mode, setMode] = useState<Mode>();
  const [ref, state] = useScratch(params);
  const { dx, dy, x, y, isScratching } = state;
  const prevState = usePrevios(state);
  const dispatch = useDispatch()

  useEffect(() => {
    if (prevState && prevState.isScratching && !isScratching) {
      const id = drawings.length + 1 + "";
      _nextLineDrawing(id);
      _nextRectDrawing(id);
    }
  }, [isScratching]);

  function onScratch(state: ScratchSensorState) {}

  function _nextLineDrawing(id) {
    if (mode === "line") {
      const nextDrawing = {
        id,
        type: mode,
        x1: prevState.x,
        y1: prevState.y,
        x2: prevState.x + prevState.dx,
        y2: prevState.y + prevState.dy,
      };
      dispatch(createDraw(nextDrawing))
    }
  }

  function _nextRectDrawing(id) {
    if (mode === "rect") {
      const nextDrawing = {
        id,
        type: mode,
        width: Math.abs(prevState.dx),
        height: Math.abs(prevState.dy),
        x: prevState.dx > 0 ? prevState.x : prevState.x + prevState.dx,
        y: prevState.dy > 0 ? prevState.y : prevState.y + prevState.dy,
      };
      dispatch(createDraw(nextDrawing))
    }
  }

  function _drawLine(line) {
    const { id, x1, y1, x2, y2 } = line;
    return <line key={id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />;
  }

  function _drawRect(rect) {
    const { id, x, y, width, height } = rect;
    return (
      <rect key={id} x={x} y={y} width={width} height={height} stroke="black" fill="azure" />
    );
  }

  function _renderDrawings() {
    return drawings.map((draw) => {
      const { type } = draw;
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
