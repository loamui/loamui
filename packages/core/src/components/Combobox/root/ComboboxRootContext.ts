"use client";

import { createContext } from "react";
import type { RefObject } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface ComboboxLabels {
  /** The live status read when the list changes. @default "n results available" */
  status?: (count: number) => string;
  /** What Combobox.Empty says. @default "No results" */
  empty?: string;
  /** The Trigger's accessible name. @default "Show options" */
  toggle?: string;
}

export interface ComboboxContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  value: string | null;
  inputValue: string;
  /** The user edited the text: value is no longer an option, until one is chosen. */
  type: (text: string) => void;
  commit: (value: string, label: string) => void;
  clear: () => void;
  /** Adopt a selected option's label as the text when nothing has been typed yet. */
  adoptLabel: (label: string) => void;
  highlightedId: string | null;
  highlight: (id: string | null) => void;
  releaseHighlight: (id: string) => void;
  moveHighlight: (to: "next" | "previous" | "first" | "last") => void;
  registerOption: (option: ComboboxOptionEntry) => () => void;
  /** The registered option with this id, if it is still mounted. */
  getOption: (id: string) => ComboboxOptionEntry | undefined;
  count: number;
  listId: string;
  anchorName: string;
  inputRef: RefObject<HTMLInputElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
  labels: Required<ComboboxLabels>;
}

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);

export function useComboboxContext(part: string): ComboboxContextValue {
  return useRequiredContext(ComboboxContext, part, "Combobox.Root");
}

export function defaultStatus(count: number): string {
  return count === 1 ? "1 result available" : `${count} results available`;
}

export const NO_LABELS: ComboboxLabels = {};

export interface ComboboxOptionEntry {
  id: string;
  value: string;
  disabled?: boolean;
  ref: RefObject<HTMLElement | null>;
}

/**
 * The collection in the order it is painted. Registration order is mount
 * order, which a reordered or filtered list does not preserve, so the nodes
 * settle the order — the one question only the document can answer.
 */
export function inPaintedOrder(options: Iterable<ComboboxOptionEntry>): ComboboxOptionEntry[] {
  return [...options]
    .filter((option) => !option.disabled && option.ref.current)
    .sort((a, b) =>
      a.ref.current!.compareDocumentPosition(b.ref.current!) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    );
}
