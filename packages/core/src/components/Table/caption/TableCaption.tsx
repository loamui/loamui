// No "use client": a pass-through over the native element the Table's scope
// already styles. It names the anatomy — every element the scope paints is
// reachable as a part — rather than re-implementing the table.
import type { PartProps } from "../../../utils/props.js";

export interface TableCaptionProps extends PartProps<"caption"> {}

/** The table's name. Put it first: it is the accessible name of the region. */
export function TableCaption(props: TableCaptionProps) {
  return <caption {...props} />;
}
