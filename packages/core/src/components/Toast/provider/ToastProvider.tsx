"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "./ToastProviderContext.js";
import type { ToastContextValue, ToastData, ToastOptions } from "./ToastProviderContext.js";

/**
 * Transient notifications, composed from parts.
 *
 * The Viewport renders with `popover="manual"`, so the browser provides the
 * top layer (above every dialog and popover, no z-index war) and nothing can
 * light-dismiss it. Announcements are native live-region semantics: each
 * toast is `role="status"` (polite) or `role="alert"` for
 * `priority: "high"`. Timers pause while the pointer or keyboard focus is
 * inside the viewport (WCAG 2.2.1), and F6 jumps focus into the viewport to
 * reach a toast's actions from anywhere.
 *
 * Fire toasts with the `useToast` hook; render them with the parts (or the
 * ready-made `<Toasts />` viewport):
 *
 * ```tsx
 * // once, near the app root
 * <Toast.Provider>
 *   <App />
 *   <Toasts />
 * </Toast.Provider>
 *
 * // anywhere below
 * const toast = useToast();
 * toast.add({ title: "Saved", description: "Your changes are live." });
 * ```
 *
 * Toasts are for confirmations and background events, never for errors the
 * user must fix (use Field errors or an Alert in place), and never as the
 * only record of something important.
 */
export interface ToastProviderProps {
  /** Default auto-dismiss delay in ms. @default 5000 */
  timeout?: number;
  /** Most toasts shown at once; the oldest closes first. @default 3 */
  limit?: number;
  children: ReactNode;
}

let toastCounter = 0;

export function ToastProvider({ timeout = 5000, limit = 3, children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  // Mirror of `toasts` so `add` can compute the next list (and which toasts
  // get dropped) without side effects inside the state updater.
  const toastsRef = useRef<ToastData[]>([]);
  const [exiting, setExiting] = useState<ReadonlySet<string>>(new Set());
  // Per-toast countdown bookkeeping so pause/resume keeps the remaining time.
  const timers = useRef(
    new Map<
      string,
      {
        handle: ReturnType<typeof setTimeout> | null;
        remaining: number;
        startedAt: number;
      }
    >(),
  );
  const pausedRef = useRef(false);
  const mounted = useRef(new Set<string>());

  const clearTimer = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    timers.current.delete(id);
  }, []);

  const remove = useCallback(
    (id: string) => {
      toastsRef.current = toastsRef.current.filter((t) => t.id !== id);
      setToasts(toastsRef.current);
      setExiting((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      clearTimer(id);
    },
    [clearTimer],
  );

  // Two-phase close: mark the toast as exiting so its Root can play the
  // exit transition, then the Root removes it. A toast with no Root
  // rendered has nothing to animate and goes at once.
  const close = useCallback(
    (id?: string) => {
      const ids = id ? [id] : toastsRef.current.map((t) => t.id);
      for (const each of ids) {
        clearTimer(each);
        if (mounted.current.has(each)) setExiting((prev) => new Set(prev).add(each));
        else remove(each);
      }
    },
    [clearTimer, remove],
  );

  const schedule = useCallback(
    (id: string, remaining: number) => {
      const handle = pausedRef.current ? null : setTimeout(() => close(id), remaining);
      timers.current.set(id, { handle, remaining, startedAt: Date.now() });
    },
    [close],
  );

  const add = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? `loam-toast-${++toastCounter}`;
      const data: ToastData = { priority: "normal", ...options, id };
      const prev = toastsRef.current;
      const appended = prev.some((t) => t.id === id)
        ? prev.map((t) => (t.id === id ? data : t))
        : [...prev, data];
      const dropIndex = Math.max(0, appended.length - limit);
      for (const dropped of appended.slice(0, dropIndex)) clearTimer(dropped.id);
      toastsRef.current = appended.slice(dropIndex);
      setToasts(toastsRef.current);
      const delay = options.timeout ?? timeout;
      clearTimer(id);
      if (delay > 0) schedule(id, delay);
      return id;
    },
    [limit, timeout, schedule, clearTimer],
  );

  const pause = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    for (const [id, t] of timers.current) {
      if (!t.handle) continue;
      clearTimeout(t.handle);
      timers.current.set(id, {
        handle: null,
        remaining: Math.max(0, t.remaining - (Date.now() - t.startedAt)),
        startedAt: Date.now(),
      });
    }
  }, []);

  const resume = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    for (const [id, t] of timers.current) {
      schedule(id, t.remaining);
    }
  }, [schedule]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      for (const t of map.values()) {
        if (t.handle) clearTimeout(t.handle);
      }
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, exiting, add, close, remove, mounted: mounted.current, pause, resume }),
    [toasts, exiting, add, close, remove, pause, resume],
  );

  return <ToastContext value={value}>{children}</ToastContext>;
}

/** The words the Viewport speaks. */
