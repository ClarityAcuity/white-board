import { useEffect } from "react";

export interface ListenerType1 {
  addEventListener(
    name: string,
    handler: (event?: any) => void,
    ...args: any[]
  );

  removeEventListener(
    name: string,
    handler: (event?: any) => void,
    ...args: any[]
  );
}

export interface ListenerType2 {
  on(name: string, handler: (event?: any) => void, ...args: any[]);

  off(name: string, handler: (event?: any) => void, ...args: any[]);
}

export type UseEventTarget = ListenerType1 | ListenerType2;

function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["addEventListener"]> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(
      ...(args as Parameters<HTMLElement["addEventListener"]>)
    );
  }
}

function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args:
    | Parameters<T["removeEventListener"]>
    | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(
      ...(args as Parameters<HTMLElement["removeEventListener"]>)
    );
  }
}

const isBrowser = typeof window !== "undefined";

const defaultTarget = isBrowser ? window : null;

const isListenerType1 = (target: any): target is ListenerType1 => {
  return !!target.addEventListener;
};
const isListenerType2 = (target: any): target is ListenerType2 => {
  return !!target.on;
};

export type AddEventListener<T> = T extends ListenerType1
  ? T["addEventListener"]
  : T extends ListenerType2
  ? T["on"]
  : never;

export type UseEventOptions<T> = Parameters<AddEventListener<T>>[2];

const useEvent = <T extends UseEventTarget>(
  name: Parameters<AddEventListener<T>>[0],
  handler?: null | undefined | Parameters<AddEventListener<T>>[1],
  target: null | T | Window = defaultTarget,
  options?: UseEventOptions<T>
) => {
  useEffect(() => {
    if (!handler) {
      return;
    }
    if (!target) {
      return;
    }
    if (isListenerType1(target)) {
      on(target, name, handler, options);
    } else if (isListenerType2(target)) {
      target.on(name, handler, options);
    }
    return () => {
      if (isListenerType1(target)) {
        off(target, name, handler, options);
      } else if (isListenerType2(target)) {
        target.off(name, handler, options);
      }
    };
  }, [name, handler, target, JSON.stringify(options)]);
};

export default useEvent;
