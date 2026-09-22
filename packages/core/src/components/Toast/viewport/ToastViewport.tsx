"use client";

import { useEffect, useMemo, useRef } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { useSupports } from "../../../hooks/use-support.js";
import { useToastContext } from "../provider/ToastProviderContext.js";

export interface ToastViewportLabels {
  /** The landmark's accessible name. @default "Notifications" */
  region?: string;
}

export interface ToastViewportProps extends PartProps<"div"> {
  /** The words the region speaks: `region` names the landmark. */
  labels?: ToastViewportLabels;
}

/** The popover API, probed on the element prototype. */
export function supportsPopover(): boolean {
  return typeof HTMLElement !== "undefined" && "showPopover" in HTMLElement.prototype;
}

export function ToastViewport({
  labels,
  className,
  children,
  ref: refProp,
  ...rest
}: ToastViewportProps) {
  const ctx = useToastContext("Toast.Viewport");
  const ref = useRef<HTMLDivElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, ref), [refProp]);
  const enhanced = useSupports(supportsPopover);

  // The viewport stays in the top layer permanently so toasts inserted into
  // it are announced by their live-region roles: a hidden container would
  // swallow the first announcement.
  useEffect(() => {
    const el = ref.current;
    if (!el || !enhanced) return;
    if (!el.matches(":popover-open")) el.showPopover();
  }, [enhanced]);

  // F6 jumps focus into the notifications region (and back out on Escape via
  // the browser's normal focus behaviour; the viewport never traps).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "F6" || ctx.toasts.length === 0) return;
      const el = ref.current;
      if (!el || el.contains(document.activeElement)) return;
      e.preventDefault();
      el.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ctx.toasts.length]);

  const regionLabel = labels?.region ?? "Notifications";

  return (
    <div
      aria-label={regionLabel}
      {...rest}
      ref={composedRef}
      role="region"
      tabIndex={-1}
      popover={enhanced ? "manual" : undefined}
      className={cx("loam-Toast-viewport", className)}
      data-empty={ctx.toasts.length === 0 || undefined}
      // no-noninteractive-element-interactions is off for this file
      // (.oxlintrc): hover/focus pause the timers (WCAG 2.2.1); the
      // region is never clickable
      onPointerEnter={ctx.pause}
      onPointerLeave={ctx.resume}
      onFocus={ctx.pause}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) ctx.resume();
      }}
    >
      {children}
    </div>
  );
}

/** The toast a Root renders, read by the parts inside it. */
