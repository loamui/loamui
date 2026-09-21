"use client";

import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useStepperContext } from "../root/StepperRootContext.js";

export interface StepperTitleProps extends PartProps<"span"> {
  /**
   * Render as another element: `render={<h3 />}` when each step is a
   * section of the page, `render={<a href="…" />}` for a complete step
   * the reader can go back to. The part's class and attributes merge onto
   * the element it renders.
   */
  render?: RenderProp<Record<string, unknown>>;
  children?: ReactNode;
}

/** The step's name. A `span` by default; see `render`. */
export function StepperTitle({ render, className, children, ref, ...rest }: StepperTitleProps) {
  useStepperContext("Stepper.Title");
  if (render) {
    return (
      <>{renderWithProps(render, { ref, className: cx("title", className), children, ...rest })}</>
    );
  }
  return (
    <span ref={ref} className={cx("title", className)} {...rest}>
      {children}
    </span>
  );
}
