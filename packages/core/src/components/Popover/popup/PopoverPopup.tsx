"use client";

import { useMemo } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs, idList } from "../../../utils/render.js";
import { popupProps, usePopup } from "../../../hooks/use-popup.js";
import { usePopoverContext } from "../root/PopoverRootContext.js";

export interface PopoverPopupProps extends PartProps<"div"> {
  /** Which side of the trigger the panel opens toward. @default "bottom" */
  side?: "bottom" | "top";
}

export function PopoverPopup({
  side = "bottom",
  className,
  children,
  style,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ref: refProp,
  ...rest
}: PopoverPopupProps) {
  const ctx = usePopoverContext("Popover.Popup");
  const composedRef = useMemo(() => composeRefs(refProp, ctx.popupRef), [refProp, ctx.popupRef]);
  usePopup(ctx);

  return (
    // The wiring below wins over rest (CONTRIBUTING: one merge contract).
    <div
      {...rest}
      {...popupProps(ctx, side, style)}
      ref={composedRef}
      role="dialog"
      tabIndex={-1}
      aria-labelledby={idList(ctx.hasTitle ? ctx.titleId : undefined, labelledBy)}
      aria-describedby={idList(ctx.hasDescription ? ctx.descriptionId : undefined, describedBy)}
      className={cx("loam-Popover-popup", className)}
    >
      {children}
    </div>
  );
}

/** Wiring the Title attaches to whatever it renders. */
