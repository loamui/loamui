import type { PartProps } from "../../../utils/props.js";

export interface TableCaptionProps extends PartProps<"caption"> {}

/** The table's name. Put it first: it is the accessible name of the region. */
export function TableCaption(props: TableCaptionProps) {
  return <caption {...props} />;
}
