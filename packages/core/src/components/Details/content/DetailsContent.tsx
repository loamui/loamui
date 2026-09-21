import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface DetailsContentProps extends PartProps<"div"> {
  children?: ReactNode;
}

/** The revealed body: padded, muted prose. */
export function DetailsContent({ className, children, ref, ...rest }: DetailsContentProps) {
  return (
    <div ref={ref} className={cx("content", className)} {...rest}>
      {children}
    </div>
  );
}
