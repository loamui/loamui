"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useDialogContext, useDialogDescription } from "../../../hooks/use-dialog.js";
import { COMPONENT } from "../root/ModalRootContext.js";

export interface ModalDescriptionProps extends PartProps<"p"> {}

export function ModalDescription({ className, children, ...rest }: ModalDescriptionProps) {
  const ctx = useDialogContext(COMPONENT, "Description");
  const id = useDialogDescription(ctx);
  return (
    <p className={cx("description", className)} id={id} {...rest}>
      {children}
    </p>
  );
}
