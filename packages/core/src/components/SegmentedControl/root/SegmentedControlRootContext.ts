"use client";

import { createContext } from "react";

import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface SegmentedControlContextValue {
  name: string;
  /** Controlled value (undefined = uncontrolled group). */
  value?: string;
  defaultValue?: string;
  select: (value: string) => void;
}

export const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

export function useSegmentedControl(part: string): SegmentedControlContextValue {
  return useRequiredContext(SegmentedControlContext, part, "SegmentedControl.Root");
}
