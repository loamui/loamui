"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useFieldContext } from "../root/FieldRootContext.js";

export interface FieldLabelProps extends PartProps<"label"> {
  /** Mark the field optional in text rather than with a required asterisk. */
  optional?: boolean;
}

export function FieldLabel({ optional, className, children, ref, ...rest }: FieldLabelProps) {
  const ctx = useFieldContext("Field.Label");
  return (
    <label ref={ref} className={cx("loam-Field-label", className)} htmlFor={ctx.fieldId} {...rest}>
      {children}
      {optional && (
        <>
          {" "}
          <span className="optional">{ctx.labels.optional}</span>
        </>
      )}
    </label>
  );
}
