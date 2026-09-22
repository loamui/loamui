"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { hasContent as hasMessageContent } from "../../../utils/content.js";
import { useIsoLayoutEffect } from "../../../hooks/use-id-registry.js";
import { useDateInputContext } from "../root/DateInputRootContext.js";

export interface DateInputErrorProps extends PartProps<"p"> {}

export function DateInputError({ id, className, children, ref, ...rest }: DateInputErrorProps) {
  const ctx = useDateInputContext("DateInput.Error");
  const { registerError } = ctx;
  const hasContent = hasMessageContent(children);
  const errorId = id ?? ctx.errorId;
  useIsoLayoutEffect(() => {
    if (hasContent) return registerError(errorId);
  }, [hasContent, errorId, registerError]);

  if (!hasContent) return null;
  return (
    <p ref={ref} id={errorId} role="alert" className={cx("error", className)} {...rest}>
      <span className="loam-VisuallyHidden">{ctx.errorPrefix}</span>
      {children}
    </p>
  );
}
