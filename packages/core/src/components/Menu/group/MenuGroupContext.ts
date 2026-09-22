"use client";

import { createContext, useId, useMemo } from "react";
import { usePresence } from "../../../hooks/use-presence.js";

export interface MenuRadioGroupContextValue {
  value: string | undefined;
  select: (value: string) => void;
}

export const MenuRadioGroupContext = createContext<MenuRadioGroupContextValue | null>(null);

export interface MenuGroupContextValue {
  labelId: string;
  registerLabel: () => () => void;
}

export const MenuGroupContext = createContext<MenuGroupContextValue | null>(null);

/** A group's label registration: `aria-labelledby` only once a GroupLabel exists. */
export function useGroupLabel() {
  const autoId = useId();
  const labelId = `${autoId}-menugroup`;
  const [hasLabel, registerLabel] = usePresence();
  const value = useMemo(() => ({ labelId, registerLabel }), [labelId, registerLabel]);
  return { value, labelledBy: hasLabel ? labelId : undefined };
}
