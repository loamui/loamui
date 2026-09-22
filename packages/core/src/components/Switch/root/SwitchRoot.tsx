import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface SwitchRootProps extends Omit<
  PartProps<"span">,
  "defaultChecked" | "defaultValue"
> {}

/** The toggle's anatomy: wraps the Control and the Track it sits over. */
export function SwitchRoot({ className, ...rest }: SwitchRootProps) {
  return <span className={cx("loam-Switch-control", className)} {...rest} />;
}
