"use client";

import { createContext } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";

/**
 * What a Tab tells the Root about itself. The tabs are the Root's own
 * collection rather than something re-read from the DOM: roving focus and the
 * fallback selection both need to know which tabs exist and which are
 * disabled, and that is the Tab's own knowledge, not the markup's.
 */
export interface TabsTabEntry {
  value: string;
  disabled?: boolean;
  node: HTMLButtonElement | null;
}

export interface TabsContextValue {
  value: string | null;
  setValue: (value: string) => void;
  isControlled: boolean;
  /** Stable id prefix so tab/panel aria wiring links up. */
  baseId: string;
  registerTab: (tab: TabsTabEntry) => () => void;
  /** The selectable tabs in the order they are painted. */
  enabledTabs: () => TabsTabEntry[];
  /** Changes whenever the collection does, so effects can depend on it. */
  tabCount: number;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(part: string): TabsContextValue {
  return useRequiredContext(TabsContext, part, "Tabs.Root");
}
