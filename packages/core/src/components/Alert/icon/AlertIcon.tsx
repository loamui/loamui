import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface AlertIconProps extends PartProps<"span"> {}

export function AlertIcon({ className, children, ref, ...rest }: AlertIconProps) {
  return (
    <span ref={ref} className={cx("icon", className)} aria-hidden {...rest}>
      {children}
    </span>
  );
}
