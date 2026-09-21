"use client";

import type { ReactNode } from "react";

import type { PartProps } from "../../../utils/props.js";

export interface ErrorSummaryListProps extends PartProps<"ul"> {
  children?: ReactNode;
}

export function ErrorSummaryList({ className, children, ...rest }: ErrorSummaryListProps) {
  return (
    <ul className={className} {...rest}>
      {children}
    </ul>
  );
}
