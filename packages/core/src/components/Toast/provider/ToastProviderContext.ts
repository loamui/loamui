"use client";

import { createContext } from "react";
import type { ReactNode } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  /** Optional action rendered as a button, e.g. Undo. */
  action?: { label: ReactNode; onClick: () => void };
  /**
   * `"high"` announces assertively (`role="alert"`) and should be reserved
   * for urgent, time-sensitive messages. @default "normal"
   */
  priority?: "normal" | "high";
  /** Auto-dismiss delay in ms; 0 keeps the toast until dismissed. */
  timeout?: number;
  /** Stable id: adding again with the same id updates in place. */
  id?: string;
}

export interface ToastData extends ToastOptions {
  id: string;
}

export interface ToastContextValue {
  toasts: ToastData[];
  /** Ids currently playing their exit transition. */
  exiting: ReadonlySet<string>;
  /** Show a toast (or update the one with the same id). Returns its id. */
  add: (options: ToastOptions) => string;
  /** Dismiss one toast by id, or all when omitted. */
  close: (id?: string) => void;
  /** Drop a toast from the list once its exit has played. */
  remove: (id: string) => void;
  /** The Roots currently mounted, by toast id: they play the exit. */
  mounted: Set<string>;
  /** Timers pause while the pointer/focus is inside the viewport. */
  pause: () => void;
  resume: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastContext(part: string): ToastContextValue {
  return useRequiredContext(ToastContext, part, "Toast.Provider");
}

/** Fire and dismiss toasts from anywhere under a Toast.Provider. */
export function useToast(): Pick<ToastContextValue, "toasts" | "add" | "close"> {
  return useToastContext("useToast");
}
