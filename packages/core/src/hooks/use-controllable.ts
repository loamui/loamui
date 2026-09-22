"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Controlled-or-uncontrolled state: the prop owns the value when defined,
 * else the hook does. The setter is stable, ignores a no-op, and reports
 * every proposed change through `onChange` on both paths.
 */
export function useControllable<T>(
  prop: T | undefined,
  fallback: T,
  onChange?: (next: T) => void,
): [value: T, set: (next: T) => void] {
  const [own, setOwn] = useState(fallback);
  const value = prop === undefined ? own : prop;
  const valueRef = useRef(value);
  valueRef.current = value;
  const controlledRef = useRef(false);
  controlledRef.current = prop !== undefined;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const set = useCallback((next: T) => {
    if (Object.is(next, valueRef.current)) return;
    if (!controlledRef.current) setOwn(next);
    onChangeRef.current?.(next);
  }, []);
  return [value, set];
}
