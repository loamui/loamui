import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface AlertRootProps extends Omit<PartProps<"div">, "color" | "title"> {}

/**
 * Polite by default: `role="status"` announces without interrupting, which
 * suits a message that is on the page when it loads. Pass `role="alert"` for
 * a message that appears in response to something and must interrupt.
 */
export function AlertRoot({ className, children, ref, ...rest }: AlertRootProps) {
  return (
    <div ref={ref} role="status" className={cx("loam-Alert", className)} {...rest}>
      {children}
    </div>
  );
}
