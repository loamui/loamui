"use client";

import { createContext } from "react";
import type { ReactNode } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";
import type { FieldsetLabels } from "../../Fieldset/root/FieldsetRootContext.js";

export interface RadioGroupLabels extends FieldsetLabels {
  /**
   * The hidden words before an Error's message, so the announcement is
   * unmistakable out of context. @default "Error: "
   */
  errorPrefix?: ReactNode;
}

export const DEFAULT_ERROR_PREFIX = "Error: ";

export interface RadioGroupPartsContextValue {
  descriptionId: string;
  errorId: string;
  errorPrefix: ReactNode;
  registerDescription: (id: string) => () => void;
  registerError: (id: string) => () => void;
}

export const RadioGroupPartsContext = createContext<RadioGroupPartsContextValue | null>(null);

export function useRadioGroupParts(part: string): RadioGroupPartsContextValue {
  return useRequiredContext(RadioGroupPartsContext, part, "RadioGroup.Root");
}
