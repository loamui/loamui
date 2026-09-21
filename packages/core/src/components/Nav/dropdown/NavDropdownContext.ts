"use client";

import { createContext } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";
import type { PopupState } from "../../../hooks/use-popup.js";

export const NavDropdownContext = createContext<PopupState | null>(null);

export function useDropdown(part: string): PopupState {
  return useRequiredContext(NavDropdownContext, part, "Nav.Dropdown");
}
