import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface AlertBodyProps extends PartProps<"div"> {}

export function AlertBody({ className, children, ref, ...rest }: AlertBodyProps) {
  return (
    <div ref={ref} className={cx("body", className)} {...rest}>
      {children}
    </div>
  );
}
