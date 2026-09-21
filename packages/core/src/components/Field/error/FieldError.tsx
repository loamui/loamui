"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { hasContent } from "../../../utils/content.js";
import { useIsoLayoutEffect } from "../../../hooks/use-id-registry.js";
import { useFieldContext } from "../root/FieldRootContext.js";

export interface FieldErrorProps extends PartProps<"p"> {}

export function FieldError({ id, className, children, ref, ...rest }: FieldErrorProps) {
  const ctx = useFieldContext("Field.Error");
  const { registerError } = ctx;
  const present = hasContent(children);
  const errorId = id ?? ctx.errorId;
  useIsoLayoutEffect(() => {
    if (present) return registerError(errorId);
  }, [present, errorId, registerError]);

  if (!present) return null;
  return (
    <p
      ref={ref}
      className={cx("loam-Field-error error", className)}
      id={errorId}
      role="alert"
      {...rest}
    >
      <span className="loam-VisuallyHidden">{ctx.labels.errorPrefix}</span>
      {children}
    </p>
  );
}

/** Accessibility props the Control wires onto whatever it renders. */
