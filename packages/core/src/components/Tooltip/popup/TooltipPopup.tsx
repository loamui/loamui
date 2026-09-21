"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";
import { usePopoverReconcile } from "../../../hooks/use-popup.js";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { useTooltipContext } from "../root/TooltipRootContext.js";

export interface TooltipPopupProps extends PartProps<"span"> {
  /** Which side of the trigger the bubble appears on. @default "top" */
  side?: "top" | "bottom" | "left" | "right";
}

export function TooltipPopup({
  side = "top",
  className,
  children,
  style,
  onPointerEnter,
  onPointerLeave,
  ref: refProp,
  ...rest
}: TooltipPopupProps) {
  const ctx = useTooltipContext("Tooltip.Popup");
  const { open, enhanced, hideNow } = ctx;
  const ref = useRef<HTMLSpanElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, ref), [refProp]);

  usePopoverReconcile(ref, open, enhanced);

  // A hint popover can be closed natively (another hint opening, light
  // dismiss); mirror that back into state.
  useEffect(() => {
    const el = ref.current;
    if (!el || !enhanced) return;
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === "closed") hideNow();
    };
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, [enhanced, hideNow]);

  return (
    // rest cannot override what follows: the hover/focus tracking and
    // aria-describedby are the 1.4.13 contract; pointer handlers chain
    // consumer handlers rather than replacing them.
    <span
      {...rest}
      ref={composedRef}
      id={ctx.bubbleId}
      role="tooltip"
      popover={enhanced ? ctx.popoverKind : undefined}
      hidden={enhanced || open ? undefined : true}
      className={cx("loam-Tooltip-popup", className)}
      data-side={side}
      data-open={open || undefined}
      style={{ ...style, positionAnchor: ctx.anchorName } as CSSProperties}
      // The bubble must stay open while hovered (WCAG 1.4.13 hoverable).
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        ctx.bubbleEnter();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        ctx.bubbleLeave();
      }}
    >
      {children}
    </span>
  );
}
