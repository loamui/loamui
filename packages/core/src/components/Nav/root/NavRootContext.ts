"use client";

import { createContext } from "react";

import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface NavLabels {
  /**
   * The landmark's accessible name while no `Nav.Title` is rendered. A
   * Title names the nav by itself, and an `aria-label` or
   * `aria-labelledby` you pass wins over both. @default "Navigation"
   */
  navigation?: string;
}

export const DEFAULT_LABELS: Required<NavLabels> = {
  navigation: "Navigation",
};

export interface NavContextValue {
  /** The id the Title renders, minted by the Root. */
  nameId: string;
  register: (id: string) => () => void;
}

export const NavContext = createContext<NavContextValue | null>(null);

export function useNav(part: string): NavContextValue {
  return useRequiredContext(NavContext, part, "Nav.Root");
}
