"use client";

import { useEffect } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { usePopoverContext } from "../root/PopoverRootContext.js";

export interface PopoverDescriptionProps extends PartProps<"p"> {}

export function PopoverDescription({ className, children, ...rest }: PopoverDescriptionProps) {
  const ctx = usePopoverContext("Popover.Description");
  const { registerDescription } = ctx;
  useEffect(() => registerDescription(), [registerDescription]);
  return (
    <p className={cx("description", className)} id={ctx.descriptionId} {...rest}>
      {children}
    </p>
  );
}

/** Wiring the Close part attaches to whatever it renders. */
