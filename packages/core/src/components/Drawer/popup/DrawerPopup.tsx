"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useDialogContext, useDialogPopup } from "../../../hooks/use-dialog.js";
import { COMPONENT } from "../root/DrawerRootContext.js";

export type DrawerSide = "start" | "end" | "top" | "bottom";

export interface DrawerPopupProps extends Omit<PartProps<"dialog">, "open"> {
  /** Edge the panel slides in from. @default "start" */
  side?: DrawerSide;
}

export function DrawerPopup({
  side = "start",
  className,
  children,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: DrawerPopupProps) {
  const ctx = useDialogContext(COMPONENT, "Popup");
  const dialogProps = useDialogPopup(ctx, {
    ref,
    label: ariaLabel,
    labelledBy: ariaLabelledBy,
    describedBy: ariaDescribedBy,
  });

  return (
    // The wiring below wins over rest (CONTRIBUTING: one merge contract).
    <dialog
      {...rest}
      {...dialogProps}
      // Missing from React's typings; lowercase passes through as an attribute.
      {...({ closedby: "any" } as object)}
      className={cx("loam-Drawer-popup", className)}
      data-side={side}
    >
      {children}
    </dialog>
  );
}
