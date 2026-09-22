"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useDialogContext, useDialogTitle } from "../../../hooks/use-dialog.js";
import { COMPONENT } from "../root/DrawerRootContext.js";

export interface DrawerTitleProps extends PartProps<"h2"> {}

export function DrawerTitle({ className, children, ...rest }: DrawerTitleProps) {
  const ctx = useDialogContext(COMPONENT, "Title");
  const id = useDialogTitle(ctx);
  return (
    <h2 className={cx("title", className)} id={id} {...rest}>
      {children}
    </h2>
  );
}
