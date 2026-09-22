import type { PartProps } from "../../../utils/props.js";

export interface SelectOptionProps extends PartProps<"option"> {}

/**
 * One choice. An option with `value=""` is the empty choice: the scope styles
 * the closed Select as placeholder text while it is the one selected.
 */
export function SelectOption(props: SelectOptionProps) {
  return <option {...props} />;
}
