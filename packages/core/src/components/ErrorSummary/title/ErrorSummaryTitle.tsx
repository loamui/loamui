"use client";

import type { PartProps } from "../../../utils/props.js";

import { useErrorSummaryContext } from "../root/ErrorSummaryRootContext.js";

export interface ErrorSummaryTitleProps extends PartProps<"h2"> {}

export function ErrorSummaryTitle({ className, children, ...rest }: ErrorSummaryTitleProps) {
  const ctx = useErrorSummaryContext("ErrorSummary.Title");
  return (
    <h2 id={ctx.titleId} className={className} {...rest}>
      {children ?? "There is a problem"}
    </h2>
  );
}
