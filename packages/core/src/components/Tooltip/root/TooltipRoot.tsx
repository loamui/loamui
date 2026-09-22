"use client";

import type { FocusEvent, PointerEvent as ReactPointerEvent } from "react";
import { use, useCallback, useEffect, useId, useMemo, useRef } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { cssSafeId, supportsAnchoredPopover } from "../../../utils/anchor.js";
import { useOpenState } from "../../../hooks/use-popup.js";
import { useSupports } from "../../../hooks/use-support.js";
import {
  CLOSE_DELAY,
  SKIP_DELAY_WINDOW,
  TooltipProviderContext,
} from "../provider/TooltipProviderContext.js";
import { TooltipContext } from "./TooltipRootContext.js";
import type { TooltipContextValue } from "./TooltipRootContext.js";

/* Same coupling as Popover: top layer without anchor positioning would leave
   the bubble centred in the viewport, so both are required to enhance. */
/* popover="hint" is narrower than the popover API itself; an unknown value
   silently becomes "manual", so detect via IDL reflection and be explicit. */
function supportsHintPopover(): boolean {
  try {
    const probe = document.createElement("span");
    probe.popover = "hint";
    return probe.popover === "hint";
  } catch {
    return false;
  }
}

/* Only visible focus (keyboard) opens the bubble; programmatic or tap focus
   would otherwise defeat the touch suppression. Browsers/jsdom without
   :focus-visible fall back to treating any focus as visible. */
function isFocusVisible(el: Element): boolean {
  try {
    return el.matches(":focus-visible");
  } catch {
    return true;
  }
}

/**
 * A small floating label revealed on hover and keyboard focus.
 *
 * Tooltips are visual-only: never put essential information in one, since
 * hover is unavailable to touch users. The bubble opens after a short delay
 * (immediately on keyboard focus), stays open while hovered (WCAG 1.4.13
 * hoverable), and Escape dismisses it without moving focus (WCAG 1.4.13
 * dismissible). Hover and focus are tracked independently, so a pointer
 * passing over a focused trigger never steals the bubble away.
 * Rendering uses the native popover attribute + CSS anchor positioning where
 * supported, with a wrapper-anchored fallback elsewhere.
 *
 * ```tsx
 * <Tooltip.Root>
 *   <Tooltip.Trigger render={<IconButton aria-label="Delete" />} />
 *   <Tooltip.Popup>
 *     Delete <Tooltip.Arrow />
 *   </Tooltip.Popup>
 * </Tooltip.Root>
 * ```
 */
export interface TooltipRootProps extends PartProps<"span"> {
  /** Hover delay in ms; overrides the Provider. @default 600 */
  delay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  /** Called whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
}

export function TooltipRoot({
  delay: delayProp,
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  children,
  ...rest
}: TooltipRootProps) {
  const provider = use(TooltipProviderContext);
  const delay = delayProp ?? provider?.delay ?? 600;
  const lastVisibleAt = provider?.lastVisibleAt;

  // Every change stamps the shared activity clock, so an adjacent tooltip
  // opened within the skip window shows with no delay.
  const onChange = useCallback(
    (next: boolean) => {
      if (lastVisibleAt) lastVisibleAt.current = Date.now();
      onOpenChange?.(next);
    },
    [lastVisibleAt, onOpenChange],
  );
  const [open, setOpen] = useOpenState({ open: openProp, defaultOpen, onOpenChange: onChange });
  const openRef = useRef(open);
  openRef.current = open;
  const enhanced = useSupports(supportsAnchoredPopover);
  const popoverKind = useSupports(supportsHintPopover) ? "hint" : "manual";

  const autoId = useId();
  const bubbleId = `${cssSafeId(autoId)}-tooltip`;
  const anchorName = `--loam-anchor-${bubbleId}`;

  // Why the bubble is open. Hover and focus are independent: the bubble only
  // hides once *both* are gone, so a pointer passing over a focused trigger
  // can't steal it (WCAG 1.4.13 persistent).
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);

  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearTimers = useCallback(() => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const showNow = useCallback(() => {
    clearTimers();
    setOpen(true);
  }, [clearTimers, setOpen]);

  const scheduleShow = useCallback(() => {
    clearTimeout(hideTimer.current);
    const skipDelay = lastVisibleAt && Date.now() - lastVisibleAt.current < SKIP_DELAY_WINDOW;
    if (skipDelay || delay <= 0) {
      setOpen(true);
      return;
    }
    clearTimeout(showTimer.current);
    showTimer.current = setTimeout(() => setOpen(true), delay);
  }, [delay, lastVisibleAt, setOpen]);

  const hideNow = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers, setOpen]);

  const scheduleHide = useCallback(() => {
    // Stamp activity so an adjacent tooltip hovered during the grace period
    // still opens instantly (the pointer left while we were visible).
    if (lastVisibleAt && openRef.current) lastVisibleAt.current = Date.now();
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, [lastVisibleAt, setOpen]);

  const triggerEnter = useCallback(
    (e: ReactPointerEvent<Element>) => {
      // Hover is unavailable on touch; tapping shouldn't flash the tooltip.
      if (e.pointerType === "touch") return;
      hoveredRef.current = true;
      scheduleShow();
    },
    [scheduleShow],
  );
  const triggerLeave = useCallback(() => {
    hoveredRef.current = false;
    if (!focusedRef.current) scheduleHide();
  }, [scheduleHide]);
  const triggerFocus = useCallback(
    (e: FocusEvent<Element>) => {
      if (!isFocusVisible(e.target)) return;
      focusedRef.current = true;
      showNow();
    },
    [showNow],
  );
  const triggerBlur = useCallback(() => {
    focusedRef.current = false;
    if (!hoveredRef.current) hideNow();
  }, [hideNow]);
  const bubbleEnter = useCallback(() => {
    hoveredRef.current = true;
    clearTimeout(hideTimer.current);
  }, []);
  const bubbleLeave = useCallback(() => {
    hoveredRef.current = false;
    if (!focusedRef.current) scheduleHide();
  }, [scheduleHide]);

  // Escape dismisses without moving pointer or focus (WCAG 1.4.13).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideNow();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, hideNow]);

  const value = useMemo<TooltipContextValue>(
    () => ({
      open,
      bubbleId,
      anchorName,
      enhanced,
      popoverKind,
      hideNow,
      triggerEnter,
      triggerLeave,
      triggerFocus,
      triggerBlur,
      bubbleEnter,
      bubbleLeave,
    }),
    [
      open,
      bubbleId,
      anchorName,
      enhanced,
      popoverKind,
      hideNow,
      triggerEnter,
      triggerLeave,
      triggerFocus,
      triggerBlur,
      bubbleEnter,
      bubbleLeave,
    ],
  );

  return (
    <TooltipContext value={value}>
      <span className={cx("loam-Tooltip", className)} {...rest}>
        {children}
      </span>
    </TooltipContext>
  );
}

/** Props the Trigger wires onto whatever it renders. */
