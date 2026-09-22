"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Register actual part IDs after commit; each registration owns its cleanup. */
export function useIdRegistry() {
  const [entries, setEntries] = useState<Array<{ key: symbol; id: string }>>([]);
  const register = useCallback((id: string) => {
    const entry = { key: Symbol(), id };
    setEntries((current) => [...current, entry]);
    return () => setEntries((current) => current.filter((item) => item.key !== entry.key));
  }, []);
  return [entries.map((entry) => entry.id), register] as const;
}
