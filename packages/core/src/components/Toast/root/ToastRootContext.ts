"use client";

import { createContext } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";
import type { ToastData } from "../provider/ToastProviderContext.js";

export const ToastItemContext = createContext<ToastData | null>(null);

export function useToastItem(part: string): ToastData {
  return useRequiredContext(ToastItemContext, part, "Toast.Root");
}
