"use client";

import { createContext } from "react";

import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface RangeState {
  id: string;
  value: number;
  min: number;
  max: number;
}

export interface RangeContextValue {
  /** The input's id, for the Output's `for`. */
  inputId: string;
  /** What the input last reported; `null` before it mounts. */
  state: RangeState | null;
  report: (state: RangeState) => void;
}

export const RangeContext = createContext<RangeContextValue | null>(null);

export function useRangeContext(part: string): RangeContextValue {
  return useRequiredContext(RangeContext, part, "Range.Root");
}

export function toNumber(value: string | number | readonly string[] | undefined, fallback: number) {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}
