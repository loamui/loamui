"use client";

import { useCallback, useState } from "react";

/**
 * Tracks whether any registered part is currently mounted. Parts call
 * `register()` in an effect and clean up with its return value; `present`
 * is true while at least one registration is live.
 */
export function usePresence(): [present: boolean, register: () => () => void] {
  const [count, setCount] = useState(0);
  const register = useCallback(() => {
    setCount((n) => n + 1);
    return () => setCount((n) => n - 1);
  }, []);
  return [count > 0, register];
}
