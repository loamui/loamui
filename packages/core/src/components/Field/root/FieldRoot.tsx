"use client";

import { useId, useMemo } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useIdRegistry } from "../../../hooks/use-id-registry.js";
import { idList } from "../../../utils/render.js";
import { DEFAULT_LABELS, FieldContext } from "./FieldRootContext.js";
import type { FieldContextValue, FieldLabels } from "./FieldRootContext.js";

export interface FieldRootProps extends PartProps<"div"> {
  /** Base id for the control; auto-generated when omitted. */
  id?: string;
  /** Validation state, independent of whether an error message is rendered. */
  invalid?: boolean;
  /** The Field's own words; Label and Error read them from here. */
  labels?: FieldLabels;
}

export function FieldRoot({
  id,
  invalid = false,
  labels,
  className,
  children,
  ref,
  ...rest
}: FieldRootProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const [controls, registerControl] = useIdRegistry();
  const [descriptions, registerDescription] = useIdRegistry();
  const [errors, registerError] = useIdRegistry();
  const fieldId = controls.at(-1) ?? baseId;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const describedBy = idList(...descriptions, ...errors);
  const optionalLabel = labels?.optional ?? DEFAULT_LABELS.optional;
  const errorPrefix = labels?.errorPrefix ?? DEFAULT_LABELS.errorPrefix;

  const value = useMemo<FieldContextValue>(
    () => ({
      fieldId,
      descriptionId,
      errorId,
      invalid,
      describedBy,
      labels: { optional: optionalLabel, errorPrefix },
      registerControl,
      registerDescription,
      registerError,
    }),
    [
      fieldId,
      descriptionId,
      errorId,
      invalid,
      describedBy,
      optionalLabel,
      errorPrefix,
      registerControl,
      registerDescription,
      registerError,
    ],
  );

  return (
    <FieldContext value={value}>
      <div ref={ref} className={cx("loam-Field", className)} {...rest}>
        {children}
      </div>
    </FieldContext>
  );
}

/** A local label/description scope for an option, inheriting the surrounding validation state. */
