"use client";

import type { FocusEvent, PointerEvent as ReactPointerEvent } from "react";
import { createContext } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface TooltipContextValue {
  open: boolean;
  bubbleId: string;
  anchorName: string;
  enhanced: boolean;
  /** "hint" where the browser knows it; "manual" otherwise. */
  popoverKind: "hint" | "manual";
  hideNow: () => void;
  triggerEnter: (e: ReactPointerEvent<Element>) => void;
  triggerLeave: () => void;
  triggerFocus: (e: FocusEvent<Element>) => void;
  triggerBlur: () => void;
  bubbleEnter: () => void;
  bubbleLeave: () => void;
}

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export function useTooltipContext(part: string): TooltipContextValue {
  return useRequiredContext(TooltipContext, part, "Tooltip.Root");
}
