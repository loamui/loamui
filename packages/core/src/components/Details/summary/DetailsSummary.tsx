import type { ReactNode } from "react";

import type { PartProps } from "../../../utils/props.js";

export interface DetailsSummaryProps extends PartProps<"summary"> {
  children?: ReactNode;
}

/** The always-visible line; the chevron is aria-hidden decoration. */
export function DetailsSummary({ className, children, ref, ...rest }: DetailsSummaryProps) {
  return (
    <summary ref={ref} className={className} {...rest}>
      <span className="label">{children}</span>
      <svg
        className="chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </summary>
  );
}
