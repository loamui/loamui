"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useIsoLayoutEffect } from "../../../hooks/use-id-registry.js";
import { useDateInputContext } from "../root/DateInputRootContext.js";

export interface DateInputDescriptionProps extends PartProps<"p"> {}

export function DateInputDescription({
  id,
  className,
  children,
  ref,
  ...rest
}: DateInputDescriptionProps) {
  const ctx = useDateInputContext("DateInput.Description");
  const { registerDescription } = ctx;
  const descriptionId = id ?? ctx.descriptionId;
  useIsoLayoutEffect(
    () => registerDescription(descriptionId),
    [descriptionId, registerDescription],
  );
  return (
    <p ref={ref} id={descriptionId} className={cx("description", className)} {...rest}>
      {children}
    </p>
  );
}
