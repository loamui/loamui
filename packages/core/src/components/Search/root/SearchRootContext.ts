"use client";

import { createContext } from "react";

import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface SearchContextValue {
  /** The Input's id, for the Label's `htmlFor` when no Field names it. */
  inputId: string;
}

export const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearchContext(part: string): SearchContextValue {
  return useRequiredContext(SearchContext, part, "Search.Root");
}
