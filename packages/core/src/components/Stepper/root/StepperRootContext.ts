"use client";

import { createContext } from "react";

import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface StepperLabels {
  /** The list's name, unless you pass `aria-label` or `aria-labelledby`. @default "Steps" */
  list?: string;
  /** Read after a complete step. @default "Completed" */
  complete?: string;
  /** Read after the current step. @default "Current step" */
  current?: string;
}

export interface StepperContextValue {
  labels: Required<StepperLabels>;
}

export const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepperContext(part: string): StepperContextValue {
  return useRequiredContext(StepperContext, part, "Stepper.Root");
}

export const NO_LABELS: StepperLabels = {};
