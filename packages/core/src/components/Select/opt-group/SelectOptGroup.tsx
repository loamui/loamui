import type { PartProps } from "../../../utils/props.js";

export interface SelectOptGroupProps extends PartProps<"optgroup"> {}

/** A named set of options, labelled by its `label` attribute. */
export function SelectOptGroup(props: SelectOptGroupProps) {
  return <optgroup {...props} />;
}
