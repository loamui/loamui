import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface SwitchThumbProps extends PartProps<"span"> {}

/** The knob that moves across the Track. */
export function SwitchThumb({ className, ...rest }: SwitchThumbProps) {
  return <span className={cx("thumb", className)} {...rest} />;
}
