import { MutableRefObject } from "react";
import useEvent, {
  ListenerType1,
  AddEventListener,
  UseEventOptions,
} from "./use-event";

const useOnClick = (
  ref: MutableRefObject<Element>,
  handler: Parameters<AddEventListener<ListenerType1>>[1],
  isTriggerInside: boolean
) => {
  // Add ref and handler to effect dependencies
  // It's worth noting that because passed in handler is a new ...
  // ... function on every render that will cause this effect ...
  // ... callback/cleanup to run every render. It's not a big deal ...
  // ... but to optimize you can wrap handler in useCallback before ...
  // ... passing it into this hook.
  const options = {} as UseEventOptions<ListenerType1>;

  // clicking ref's element or descendent elements
  const listener = (event) => {
    const isInside = !ref.current || ref.current?.contains(event.target);
    if (isInside === isTriggerInside) {
      handler(event);
    }
  };
  useEvent("mousedown", listener, window, options);
  useEvent("touchstart", listener, window, options);
};

export default useOnClick;
