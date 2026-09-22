"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useDialogContext, useDialogTitle } from "../../../hooks/use-dialog.js";
import { COMPONENT } from "../root/ModalRootContext.js";

export interface ModalTitleProps extends PartProps<"h2"> {}

export function ModalTitle({ className, children, ...rest }: ModalTitleProps) {
  const ctx = useDialogContext(COMPONENT, "Title");
  const id = useDialogTitle(ctx);
  return (
    <h2 className={cx("title", className)} id={id} {...rest}>
      {children}
    </h2>
  );
}
