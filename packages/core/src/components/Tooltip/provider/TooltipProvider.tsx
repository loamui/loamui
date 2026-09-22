"use client";

import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { TooltipProviderContext } from "./TooltipProviderContext.js";

export interface TooltipProviderProps {
  /** Hover delay in ms for all tooltips underneath. @default 600 */
  delay?: number;
  children: ReactNode;
}

export function TooltipProvider({ delay = 600, children }: TooltipProviderProps) {
  const lastVisibleAt = useRef(0);
  const value = useMemo(() => ({ delay, lastVisibleAt }), [delay]);
  return <TooltipProviderContext value={value}>{children}</TooltipProviderContext>;
}
