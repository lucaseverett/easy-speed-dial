import { useRef, useEffect } from "react";

function usePrevious(value, initialValue) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  if (ref.current === undefined && initialValue !== undefined) {
    return initialValue;
  }
  return ref.current;
}

export { usePrevious };
