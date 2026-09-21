"use client";

import { useEffect, useId, useRef, useMemo } from "react";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { composeRefs } from "../../../utils/render.js";

import { ErrorSummaryContext } from "../root/ErrorSummaryRootContext.js";

/**
 * The form-level error pattern: a box at the top of the form
 * listing every error as a link to its field, shown after a failed submit.
 *
 * When it appears it takes keyboard focus, so assistive technology
 * announces the problem and the user starts at the list rather than
 * hunting. Each item links to a field by id; activating one moves focus
 * into that field. Use the same wording as the field's own error message
 * so the two read identically out of context.
 *
 * ```tsx
 * {errors.length > 0 && (
 *   <ErrorSummary.Root>
 *     <ErrorSummary.Title />
 *     <ErrorSummary.List>
 *       <ErrorSummary.Item href="#email">
 *         Enter your email address
 *       </ErrorSummary.Item>
 *     </ErrorSummary.List>
 *   </ErrorSummary.Root>
 * )}
 * ```
 */
export interface ErrorSummaryRootProps extends PartProps<"div"> {
  /**
   * Move keyboard focus to the summary when it appears. @default true
   */
  autoFocus?: boolean;
}

export function ErrorSummaryRoot({
  autoFocus = true,
  className,
  children,
  ref: refProp,
  ...rest
}: ErrorSummaryRootProps) {
  const titleId = `${useId()}-errorsummary`;
  const ctxValue = useMemo(() => ({ titleId }), [titleId]);
  const ref = useRef<HTMLDivElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, ref), [refProp]);

  // Focus announces the region (labelled by the Title) the moment it
  // appears — the user starts at the list of problems, not the top of the
  // page.
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <ErrorSummaryContext value={ctxValue}>
      <div
        {...rest}
        ref={composedRef}
        role="group"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx("loam-ErrorSummary", className)}
      >
        {/* role="alert" announces on render even without autoFocus; the
            outer group stays the focus target. */}
        <div role="alert">{children}</div>
      </div>
    </ErrorSummaryContext>
  );
}
