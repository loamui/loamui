"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useIsoLayoutEffect } from "../../../hooks/use-id-registry.js";
import { useFieldContext } from "../root/FieldRootContext.js";

export interface FieldDescriptionProps extends PartProps<"p"> {}

export function FieldDescription({ id, className, children, ref, ...rest }: FieldDescriptionProps) {
  const ctx = useFieldContext("Field.Description");
  const { registerDescription } = ctx;
  const descriptionId = id ?? ctx.descriptionId;
  useIsoLayoutEffect(
    () => registerDescription(descriptionId),
    [descriptionId, registerDescription],
  );
  return (
    <p
      ref={ref}
      className={cx("loam-Field-description description", className)}
      id={descriptionId}
      {...rest}
    >
      {children}
    </p>
  );
}
