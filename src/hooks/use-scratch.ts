import { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";
import useLatest from "./use-latest";

const noop = () => {};

export interface ScratchSensorParams {
  disabled?: boolean;
  onScratch?: (state: ScratchSensorState) => void;
  onScratchStart?: (state: ScratchSensorState) => void;
  onScratchEnd?: (state: ScratchSensorState) => void;
}

export interface ScratchSensorState {
  isScratching: boolean;
  start?: number;
  end?: number;
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
  docX?: number;
  docY?: number;
  posX?: number;
  posY?: number;
  elH?: number;
  elW?: number;
  elX?: number;
  elY?: number;
}

const useScratch = (
  params: ScratchSensorParams = {}
): [(el: HTMLElement & SVGSVGElement | null) => void, ScratchSensorState] => {
  const { disabled } = params;
  const paramsRef = useLatest(params);
  const [state, setState] = useState<ScratchSensorState>({
    isScratching: false,
  });
  const refState = useRef<ScratchSensorState>(state);
  const refScratching = useRef<boolean>(false);
  const refAnimationFrame = useRef<any>(null);
  const [el, setEl] = useState<HTMLElement & SVGSVGElement | null>(null);

  useEffect(() => {
    if (disabled) return;
    if (!el) return;

    const onMoveEvent = (docX: number, docY: number) => {
      cancelAnimationFrame(refAnimationFrame.current);
      refAnimationFrame.current = requestAnimationFrame(() => {
        const { left, top } = el.getBoundingClientRect();
        const elX = left + window.scrollX;
        const elY = top + window.scrollY;
        const dx = docX - elX;
        const dy = docY - elY;
        setState((oldState) => {
          const { x, y } = oldState;
          const newState = {
            ...oldState,
            dx: x ? dx - x : 0,
            dy: y ? dy - y : 0,
            end: Date.now(),
            isScratching: true,
          };
          refState.current = newState;
          (paramsRef.current.onScratch || noop)(newState);
          return newState;
        });
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      onMoveEvent(event.pageX, event.pageY);
    };

    const onTouchMove = (event: TouchEvent) => {
      onMoveEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
    };

    let onMouseUp: () => void;
    let onTouchEnd: () => void;

    const stopScratching = () => {
      if (!refScratching.current) return;
      refScratching.current = false;
      refState.current = { ...refState.current, isScratching: false };
      (paramsRef.current.onScratchEnd || noop)(refState.current);
      setState({ isScratching: false });
      window.removeEventListener("mousemove", throttledMouseMove);
      window.removeEventListener("touchmove", throttledTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
    };

    onMouseUp = stopScratching;
    onTouchEnd = stopScratching;

    const startScratching = (docX: number, docY: number) => {
      if (!refScratching.current) return;
      const { offsetHeight, offsetWidth } = el || {};
      const { left, top } = el.getBoundingClientRect();
      const elX = left + window.scrollX;
      const elY = top + window.scrollY;
      const x = docX - elX;
      const y = docY - elY;
      const time = Date.now();
      const newState = {
        isScratching: true,
        start: time,
        end: time,
        docX,
        docY,
        x,
        y,
        dx: 0,
        dy: 0,
        elH: offsetHeight,
        elW: offsetWidth,
        elX,
        elY,
      };
      refState.current = newState;
      (paramsRef.current.onScratchStart || noop)(newState);
      setState(newState);
      window.addEventListener("mousemove", throttledMouseMove);
      window.addEventListener("touchmove", throttledTouchMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchend", onTouchEnd);
    };

    const onMouseDown = (event: MouseEvent) => {
      refScratching.current = true;
      startScratching(event.pageX, event.pageY);
    };

    const onTouchStart = (event: TouchEvent) => {
      refScratching.current = true;
      startScratching(
        event.changedTouches[0].pageX,
        event.changedTouches[0].pageY
      );
    };
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("touchstart", onTouchStart);

    const throttledMouseMove = throttle(onMouseMove, 10);
    const throttledTouchMove = throttle(onTouchMove, 10);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mousemove", throttledMouseMove);
      window.removeEventListener("touchmove", throttledTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);

      if (refAnimationFrame.current)
        cancelAnimationFrame(refAnimationFrame.current);
      refAnimationFrame.current = null;

      refScratching.current = false;
      refState.current = { isScratching: false };
      setState(refState.current);
    };
  }, [el, disabled, paramsRef]);

  return [setEl, state];
};

export interface ScratchSensorProps extends ScratchSensorParams {
  children: (
    state: ScratchSensorState,
    ref: (el: HTMLElement & SVGSVGElement | null) => void
  ) => React.ReactElement<any>;
}

export default useScratch;
