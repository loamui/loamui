"use client";

import { useEffect, useMemo, useRef } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { useToastContext } from "../provider/ToastProviderContext.js";
import type { ToastData } from "../provider/ToastProviderContext.js";
import { ToastItemContext } from "./ToastRootContext.js";

export interface ToastRootProps extends PartProps<"div"> {
  /** The toast being rendered (from `useToast().toasts`). */
  toast: ToastData;
}

export function ToastRoot({ toast, className, children, ref: refProp, ...rest }: ToastRootProps) {
  const ctx = useToastContext("Toast.Root");
  const ref = useRef<HTMLDivElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, ref), [refProp]);
  const exiting = ctx.exiting.has(toast.id);

  const { mounted } = ctx;
  useEffect(() => {
    mounted.add(toast.id);
    return () => {
      mounted.delete(toast.id);
    };
  }, [mounted, toast.id]);

  // The exit ends when the stylesheet says so: `transitionend` on the toast
  // itself. Where no transition will run (reduced motion, no motion styles,
  // jsdom) the computed durations are all zero and the toast goes at once.
  const { remove } = ctx;
  useEffect(() => {
    const el = ref.current;
    if (!exiting || !el) return;
    const durations = getComputedStyle(el).transitionDuration || "0s";
    const animated = durations.split(",").some((d) => parseFloat(d) > 0);
    if (!animated) {
      remove(toast.id);
      return;
    }
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el) remove(toast.id);
    };
    el.addEventListener("transitionend", onEnd);
    el.addEventListener("transitioncancel", onEnd);
    return () => {
      el.removeEventListener("transitionend", onEnd);
      el.removeEventListener("transitioncancel", onEnd);
    };
  }, [exiting, remove, toast.id]);

  return (
    <ToastItemContext value={toast}>
      <div
        // A live region: role="status" announces politely on insertion;
        // role="alert" interrupts, reserved for priority: "high".
        role={toast.priority === "high" ? "alert" : "status"}
        className={cx("toast", className)}
        data-exiting={exiting || undefined}
        {...rest}
        ref={composedRef}
      >
        {children}
      </div>
    </ToastItemContext>
  );
}

/** Wiring the Title and Description attach to whatever they render. */
