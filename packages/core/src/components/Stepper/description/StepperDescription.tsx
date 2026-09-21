"use client";

import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { useStepperContext } from "../root/StepperRootContext.js";

export interface StepperDescriptionProps extends PartProps<"p"> {
  children?: ReactNode;
}

/** One or two muted sentences on what happens in this step. */
export function StepperDescription({ className, children, ref, ...rest }: StepperDescriptionProps) {
  useStepperContext("Stepper.Description");
  return (
    <p ref={ref} className={cx("description", className)} {...rest}>
      {children}
    </p>
  );
}
