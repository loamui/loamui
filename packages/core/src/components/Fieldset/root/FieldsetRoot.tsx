"use client";

import { useMemo } from "react";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { DEFAULT_LABELS, FieldsetContext, FieldsetLabels } from "../root/FieldsetRootContext.js";

export interface FieldsetRootProps extends PartProps<"fieldset"> {
  /** The Fieldset's own words; the Legend reads them from here. */
  labels?: FieldsetLabels;
}

export function FieldsetRoot({ labels, className, children, ref, ...rest }: FieldsetRootProps) {
  const optional = labels?.optional ?? DEFAULT_LABELS.optional;
  const value = useMemo<Required<FieldsetLabels>>(() => ({ optional }), [optional]);
  return (
    <FieldsetContext value={value}>
      <fieldset ref={ref} className={cx("loam-Fieldset", className)} {...rest}>
        {children}
      </fieldset>
    </FieldsetContext>
  );
}
