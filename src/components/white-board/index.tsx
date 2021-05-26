import React, { useState, useEffect, useCallback, ReactElement } from "react";
import { useDispatch } from "react-redux";
import { throttle } from "lodash";
import Menu from "../menu";
import useScratch, {
  ScratchSensorParams,
  ScratchSensorState,
} from "../../hooks/use-scratch";
import {
  ModeEnums,
  DrawStatusEnums,
  Mode,
  Draw,
  LineDraw,
  RectDraw,
} from "../../actions/action-types";
import { drawActions } from "../../actions";

const { createDraw, updateDraw, finishDraw, selectDraw } = drawActions;
const { SELECT, LINE, RECT } = ModeEnums
const { CREATED, SELECTED } = DrawStatusEnums;

interface WhiteBoard {
  width: number;
  height: number;
  selectedDraw: LineDraw | RectDraw | Draw;
  drawings: Array<LineDraw | RectDraw | Draw>;
}

const WhiteBoard = ({ width, height, selectedDraw, drawings }: WhiteBoard): ReactElement => {
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
  const [mode, setMode] = useState<Mode>(SELECT);
  const [ref, state] = useScratch(params);
  const { dx, dy, x, y } = state;
  const dispatch = useDispatch();

  const onUpdateDrawing = useCallback(
    throttle((state: ScratchSensorState) => {
      _updateDrawing(state);
    }, 100),
    [drawings]
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
    if (mode === LINE) {
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
    if (mode === RECT) {
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

  function _selectDraw(draw) {
    if (mode === SELECT) {
      console.log(draw);
      dispatch(selectDraw(draw));
    }
  }

  function _drawSelectable(draw) {
    const { id, x, y, width, height, onSelect, status } = draw;
    const isScaleUp = width <= 10 && height <= 10;

    if (mode === SELECT || status === SELECTED) {
      const isSelected = id === selectedDraw?.id;
      return (
        <rect
          x={isScaleUp ? x + width / 2 - 5 : x}
          y={isScaleUp ? y + height / 2 - 5 : y}
          width={isScaleUp ? 10 : width}
          height={isScaleUp ? 10 : height}
          stroke={isSelected ? "red" : "grey"}
          strokeDasharray="5,5"
          fillOpacity="0.0"
          onClick={onSelect}
        />
      );
    }
  }

  function _drawLine(line) {
    const { id, x1, y1, x2, y2, status } = line;
    return (
      <g key={id}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />
        {_drawSelectable({
          id,
          status,
          x: x1 < x2 ? x1 : x2,
          y: y1 < y2 ? y1 : y2,
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
          onSelect: () => _selectDraw(line),
        })}
      </g>
    );
  }

  function _drawRect(rect) {
    const { id, x, y, width, height, status } = rect;
    return (
      <g key={id}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          stroke="black"
          fill="azure"
        />
        {_drawSelectable({
          id,
          status,
          x,
          y,
          width,
          height,
          onSelect: () => _selectDraw(rect),
        })}
      </g>
    );
  }

  function _renderDrawings() {
    return drawings.map((draw) => {
      const { type, status } = draw;
      const hasShape = status !== CREATED;
      if (!hasShape) {
        return null;
      }
      if (type === LINE) {
        return _drawLine(draw);
      }
      if (type === RECT) {
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
