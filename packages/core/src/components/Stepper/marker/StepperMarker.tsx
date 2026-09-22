"use client";

import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { useStepperContext } from "../root/StepperRootContext.js";

export interface StepperMarkerProps extends PartProps<"span"> {
  /** An icon or a short label in place of the number. */
  children?: ReactNode;
}

/**
 * The circle beside the title. Empty, it shows the step's number, and a
 * check once the step is complete; children (an icon, a date) take the
 * number's place. Hidden from assistive technology: the list carries the
 * order and the Step the state.
 */
export function StepperMarker({ className, children, ref, ...rest }: StepperMarkerProps) {
  useStepperContext("Stepper.Marker");
  return (
    <span ref={ref} aria-hidden="true" className={cx("marker", className)} {...rest}>
      {children}
    </span>
  );
}
