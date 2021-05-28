import React, { useState, useEffect, useCallback, ReactElement } from "react";
import { useDispatch } from "react-redux";
import { throttle } from "lodash";
import Menu from "../menu";
import useScratch, {
  ScratchSensorParams,
  ScratchSensorState,
} from "../../hooks/use-scratch";
import Selectable from "../selectable";
import { Mode, Draw, LineDraw, RectDraw } from "../../types";
import { drawActions } from "../../actions";
import { ModeEnums, DrawStatusEnums } from "../../constants";

const {
  createDrawAction,
  updateDrawAction,
  finishDrawAction,
  selectDrawAction,
} = drawActions;
const { SELECT, LINE, RECT } = ModeEnums;
const { CREATED, SELECTED } = DrawStatusEnums;

interface WhiteBoard {
  width: number;
  height: number;
  selectedDraw: LineDraw | RectDraw | Draw;
  drawings: Array<LineDraw | RectDraw | Draw>;
}

const WhiteBoard = ({
  width,
  height,
  selectedDraw,
  drawings,
}: WhiteBoard): ReactElement => {
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
  const [movingDraw, setMovingDraw] = useState<LineDraw | RectDraw | Draw>();
  const [ref, state] = useScratch(params);
  const { dx, dy, x, y } = state;
  const dispatch = useDispatch();

  const onUpdateDrawing = throttle((state: ScratchSensorState) => {
    _updateDrawing(state);
  }, 100);

  useEffect(() => {
    onUpdateDrawing(state);
  }, [state]);

  function _createDrawing(state) {
    const nextId = drawings.length + 1 + "";
    _nextLineDrawing(nextId, createDrawAction, state);
    _nextRectDrawing(nextId, createDrawAction, state);
  }

  function _updateDrawing(state) {
    if (mode === SELECT) {
      _updateLineDrawing(updateDrawAction, state);
      _updateRectDrawing(updateDrawAction, state);
    } else {
      const id = drawings.length + "";
      _nextLineDrawing(id, updateDrawAction, state);
      _nextRectDrawing(id, updateDrawAction, state);
    }
  }

  function _finishDrawing(state) {
    if (mode === SELECT) {
      setMovingDraw(null);
      _updateLineDrawing(finishDrawAction, state);
      _updateRectDrawing(finishDrawAction, state);
    } else {
      const id = drawings.length + "";
      _nextLineDrawing(id, finishDrawAction, state);
      _nextRectDrawing(id, finishDrawAction, state);
    }
  }

  function _updateLineDrawing(action, state) {
    const { type, x1, x2, y1, y2 } = (movingDraw as LineDraw) || {};
    const { dx, dy, isScratching } = state;
    if (type === LINE && isScratching) {
      const nextDrawing = {
        ...selectedDraw,
        x1: x1 + dx,
        y1: y1 + dy,
        x2: x2 + dx,
        y2: y2 + dy,
      };
      dispatch(action(nextDrawing));
    }
  }

  function _updateRectDrawing(action, state) {
    const { type, x, y } = (movingDraw as RectDraw) || {};
    const { dx, dy, isScratching } = state;
    if (type === RECT && isScratching) {
      const nextDrawing = {
        ...selectedDraw,
        x: x + dx,
        y: y + dy,
      };
      dispatch(action(nextDrawing));
    }
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
      setMovingDraw(draw);
      dispatch(selectDrawAction(draw));
    }
  }

  function _drawSelectable(draw) {
    const { id, status } = draw;
    if (mode === SELECT || status === SELECTED) {
      return (
        <Selectable
          draw={draw}
          isSelected={id === selectedDraw?.id}
          onSelect={_selectDraw}
        />
      );
    }
  }

  function _drawLine(line) {
    const { id, x1, y1, x2, y2 } = line;
    return (
      <g key={id}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />
        {_drawSelectable(line)}
      </g>
    );
  }

  function _drawRect(rect) {
    const { id, x, y, width, height } = rect;
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
        {_drawSelectable(rect)}
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
