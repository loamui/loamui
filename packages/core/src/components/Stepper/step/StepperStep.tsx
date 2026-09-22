"use client";

import type { ReactNode } from "react";

import type { PartProps } from "../../../utils/props.js";

import { useStepperContext } from "../root/StepperRootContext.js";

export interface StepperStepProps extends PartProps<"li"> {
  /** A `Stepper.Marker`, a `Stepper.Title`, then an optional `Stepper.Description`. */
  children?: ReactNode;
}

/**
 * One step, an `li`. Pass `aria-current="step"` on the step the sequence
 * has reached; the steps before it are complete and the steps after it
 * upcoming, and each says so in hidden text. Every step carries both
 * words; the stylesheet keeps the wrong one out of the accessibility tree
 * with `display: none`, from the same `:has()` that paints the state.
 */
export function StepperStep({ className, children, ref, ...rest }: StepperStepProps) {
  const { labels } = useStepperContext("Stepper.Step");
  return (
    <li ref={ref} className={className} {...rest}>
      {children}
      <span className="state complete">
        <span className="loam-VisuallyHidden">{labels.complete}</span>
      </span>
      <span className="state current">
        <span className="loam-VisuallyHidden">{labels.current}</span>
      </span>
    </li>
  );
}
