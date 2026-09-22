"use client";

import { createContext } from "react";

/**
 * Shared by RadioGroup with the Radios beneath it — context instead of
 * cloneElement, so options participate regardless of nesting depth.
 */
export interface RadioGroupContextValue {
  name: string;
  value?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
