"use client";

import { createContext } from "react";
import type { ReactNode } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";
import type { FieldsetLabels } from "../../Fieldset/root/FieldsetRootContext.js";

export type DateInputPart = "day" | "month" | "year";

export const PART_LABELS: Record<DateInputPart, string> = {
  day: "Day",
  month: "Month",
  year: "Year",
};

/** The words a DateInput says on its own, each with an English default. */
export interface DateInputLabels extends FieldsetLabels {
  /**
   * The hidden words before an Error's message, so the announcement is
   * unmistakable out of context. @default "Error: "
   */
  errorPrefix?: ReactNode;
}

export const DEFAULT_ERROR_PREFIX = "Error: ";

export interface DateInputContextValue {
  baseId: string;
  name: string | undefined;
  autoComplete: "bday" | undefined;
  descriptionId: string;
  errorId: string;
  errorPrefix: ReactNode;
  invalid: boolean | DateInputPart[];
  registerDescription: (id: string) => () => void;
  registerError: (id: string) => () => void;
}

export const DateInputContext = createContext<DateInputContextValue | null>(null);

export function useDateInputContext(part: string): DateInputContextValue {
  return useRequiredContext(DateInputContext, part, "DateInput.Root");
}
