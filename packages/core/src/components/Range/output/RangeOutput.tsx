"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { useRangeContext } from "../root/RangeRootContext.js";

/** The words the Output shows. */
export interface RangeOutputLabels {
  /** Formats the current value. @default the number in the page's locale */
  value?: (value: number) => string;
}

export interface RangeOutputProps extends PartProps<"output"> {
  /**
   * The words the output shows: `value(n)` formats the current value
   * (default: the number in the page's locale).
   */
  labels?: RangeOutputLabels;
}

/**
 * The current value, written where a sighted user can see it: a native
 * `<output for>` bound to the input, positioned above the thumb. Belongs
 * inside `Range.Root`, beside the `Range`.
 */
export function RangeOutput({ labels, className, children, ...rest }: RangeOutputProps) {
  const ctx = useRangeContext("Range.Output");
  const format = labels?.value ?? ((n: number) => new Intl.NumberFormat().format(n));
  const value = ctx.state?.value;
  const text = value === undefined || Number.isNaN(value) ? null : format(value);

  return (
    <output {...rest} htmlFor={ctx.inputId} className={cx("loam-Range-output", className)}>
      {children ?? text}
    </output>
  );
}
