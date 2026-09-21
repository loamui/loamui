// No "use client": a pass-through over the native option the Select's scope
// already styles. It names the anatomy — every element the scope paints is
// reachable as a part — over the platform's own picker, which is what a
// native <select> buys on a phone.
import type { PartProps } from "../../../utils/props.js";

export interface SelectOptionProps extends PartProps<"option"> {}

/**
 * One choice. An option with `value=""` is the empty choice: the scope styles
 * the closed Select as placeholder text while it is the one selected.
 */
export function SelectOption(props: SelectOptionProps) {
  return <option {...props} />;
}
