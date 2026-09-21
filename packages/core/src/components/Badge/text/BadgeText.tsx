import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface BadgeTextProps extends PartProps<"span"> {}

/**
 * The label. A real element rather than a bare text node, so the pill can let
 * it shrink and truncate: bare text in a flex row is an anonymous flex item
 * and can do neither.
 */
export function BadgeText({ className, children, ref, ...rest }: BadgeTextProps) {
  return (
    <span ref={ref} className={cx("text", className)} {...rest}>
      {children}
    </span>
  );
}
