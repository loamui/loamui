"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface DateInputFieldsProps extends PartProps<"div"> {}

export function DateInputFields({ className, children, ref, ...rest }: DateInputFieldsProps) {
  return (
    <div ref={ref} className={cx("parts", className)} {...rest}>
      {children}
    </div>
  );
}
