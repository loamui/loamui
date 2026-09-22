"use client";

import type { RefObject } from "react";
import { createContext } from "react";

/** How long after one tooltip closes an adjacent one opens with no delay. */
export const SKIP_DELAY_WINDOW = 400;
/**
 * Grace period for moving the pointer from trigger to bubble. Generous on
 * purpose: magnifier panning and tremor traversal are slow — a short window
 * is a practical WCAG 1.4.13 "hoverable" failure.
 */
export const CLOSE_DELAY = 300;

export interface TooltipProviderValue {
  delay: number;
  /** Shared timestamp of recent tooltip activity, for instant adjacent opens. */
  lastVisibleAt: RefObject<number>;
}

export const TooltipProviderContext = createContext<TooltipProviderValue | null>(null);
