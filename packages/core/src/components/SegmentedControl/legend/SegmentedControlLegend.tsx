"use client";

import type { PartProps } from "../../../utils/props.js";

import { useSegmentedControl } from "../root/SegmentedControlRootContext.js";

export interface SegmentedControlLegendProps extends PartProps<"legend"> {}

/**
 * The group's name, a `legend`, painted inside the pill before the
 * segments. Hide it visually with `VisuallyHidden`; it
 * still names the group.
 */
export function SegmentedControlLegend({
  className,
  children,
  ref,
  ...rest
}: SegmentedControlLegendProps) {
  useSegmentedControl("SegmentedControl.Legend");
  return (
    <legend ref={ref} className={className} {...rest}>
      {children}
    </legend>
  );
}
