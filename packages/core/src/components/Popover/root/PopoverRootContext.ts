"use client";

import { createContext } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";
import type { PopupState } from "../../../hooks/use-popup.js";

export interface PopoverContextValue extends PopupState {
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  registerTitle: () => () => void;
  registerDescription: () => () => void;
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopoverContext(part: string): PopoverContextValue {
  return useRequiredContext(PopoverContext, part, "Popover.Root");
}
