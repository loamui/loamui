"use client";

import { useContext } from "react";

import type { PartProps } from "../../../utils/props.js";
import { FieldsetContext } from "../root/FieldsetRootContext.js";

export interface FieldsetLegendProps extends PartProps<"legend"> {
  /** Mark the whole group optional in text rather than with an asterisk. */
  optional?: boolean;
}

export function FieldsetLegend({
  optional,
  className,
  children,
  ref,
  ...rest
}: FieldsetLegendProps) {
  const labels = useContext(FieldsetContext);
  return (
    <legend ref={ref} className={className} {...rest}>
      {children}
      {optional && (
        <>
          {" "}
          <span className="optional">{labels.optional}</span>
        </>
      )}
    </legend>
  );
}
