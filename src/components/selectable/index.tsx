import React, { useRef } from "react";
import useClick from "../../hooks/use-click";

function Selectable({ draw, isSelected, onSelect }) {
  const selectableRef = useRef();
  const { x1, y1, x2, y2 } = draw;
  const {
    x = draw?.x || x1 < x2 ? x1 : x2,
    y = draw?.y || y1 < y2 ? y1 : y2,
    width = draw?.width || Math.abs(x2 - x1),
    height = draw?.height || Math.abs(y2 - y1),
  } = draw;
  const isScaleUp = width <= 10 && height <= 10;

  useClick(selectableRef, () => onSelect(draw), true);

  return (
    <rect
      ref={selectableRef}
      x={isScaleUp ? x + width / 2 - 5 : x}
      y={isScaleUp ? y + height / 2 - 5 : y}
      width={isScaleUp ? 10 : width}
      height={isScaleUp ? 10 : height}
      stroke={isSelected ? "red" : "grey"}
      strokeDasharray="5,5"
      fillOpacity="0.0"
    />
  );
}

export default Selectable;
