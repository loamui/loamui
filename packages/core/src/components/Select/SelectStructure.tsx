// No "use client": pass-throughs over the native options the Select's scope
// already styles. They name the anatomy — every element the scope paints is
// reachable as a part — over the platform's own picker, which is what a
// native <select> buys on a phone.
import type { PartProps } from "../../utils.js";

export interface SelectOptionProps extends PartProps<"option"> {}
export interface SelectOptGroupProps extends PartProps<"optgroup"> {}

/**
 * One choice. An option with `value=""` is the empty choice: the scope styles
 * the closed Select as placeholder text while it is the one selected.
 */
export function SelectOption(props: SelectOptionProps) {
  return <option {...props} />;
}

/** A named set of options, labelled by its `label` attribute. */
export function SelectOptGroup(props: SelectOptGroupProps) {
  return <optgroup {...props} />;
}
