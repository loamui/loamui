"use client";

import { useMemo } from "react";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import {
  NO_LABELS,
  StepperContext,
  StepperContextValue,
  StepperLabels,
} from "../root/StepperRootContext.js";

/**
 * A stepper: an ordered list of steps, each a marker, a title and a
 * description, that shows how far a sequence has got.
 *
 * Put `aria-current="step"` on the Step the sequence has reached and the
 * rest is detected: the steps before it in the list are complete, the
 * steps after it upcoming. The stylesheet reads that order with `:has()`,
 * both to paint each step and to choose the word a screen reader hears
 * after it (`labels.complete`, `labels.current`), so "Completed" is read
 * where a sighted reader sees a check, in the server HTML already. Without
 * a current step it is a numbered list.
 *
 * The steps stack; when the Root's container is 40rem or wider they sit in
 * a row. There is no orientation prop: a consumer who wants them stacked
 * gives them less room.
 *
 * ```tsx
 * <Stepper.Root>
 *   <Stepper.Step>
 *     <Stepper.Marker />
 *     <Stepper.Title>Order placed</Stepper.Title>
 *   </Stepper.Step>
 *   <Stepper.Step aria-current="step">
 *     <Stepper.Marker />
 *     <Stepper.Title>Being packed</Stepper.Title>
 *     <Stepper.Description>Picked and packed at the warehouse.</Stepper.Description>
 *   </Stepper.Step>
 * </Stepper.Root>
 * ```
 */
export interface StepperRootProps extends PartProps<"ol"> {
  /** The default strings, each overridable. */
  labels?: StepperLabels;
}

export function StepperRoot({
  labels: { list = "Steps", complete = "Completed", current = "Current step" } = NO_LABELS,
  className,
  children,
  ...rest
}: StepperRootProps) {
  const labels = useMemo(() => ({ list, complete, current }), [list, complete, current]);
  const ctx = useMemo<StepperContextValue>(() => ({ labels }), [labels]);

  const named = rest["aria-label"] != null || rest["aria-labelledby"] != null;

  return (
    <StepperContext value={ctx}>
      <ol
        // list-style: none drops list semantics in WebKit; the role restores "2 of 4".
        role="list"
        aria-label={named ? undefined : labels.list}
        className={cx("loam-Stepper", className)}
        {...rest}
      >
        {children}
      </ol>
    </StepperContext>
  );
}
