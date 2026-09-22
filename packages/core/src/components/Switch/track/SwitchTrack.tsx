import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface SwitchTrackProps extends PartProps<"span"> {}

/** The groove the Thumb slides along. Decoration: the input carries the state. */
export function SwitchTrack({ className, ...rest }: SwitchTrackProps) {
  return <span className={cx("track", className)} aria-hidden {...rest} />;
}
