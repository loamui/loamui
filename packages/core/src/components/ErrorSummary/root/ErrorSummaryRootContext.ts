"use client";

import { createContext } from "react";

import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface ErrorSummaryContextValue {
  titleId: string;
}

export const ErrorSummaryContext = createContext<ErrorSummaryContextValue | null>(null);

export function useErrorSummaryContext(part: string): ErrorSummaryContextValue {
  return useRequiredContext(ErrorSummaryContext, part, "ErrorSummary.Root");
}
