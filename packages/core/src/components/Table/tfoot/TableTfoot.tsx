// No "use client": a pass-through over the native element the Table's scope
// already styles. It names the anatomy — every element the scope paints is
// reachable as a part — rather than re-implementing the table.
import type { PartProps } from "../../../utils/props.js";

export interface TableTfootProps extends PartProps<"tfoot"> {}

/** The footer rows, for totals and the like. */
export function TableTfoot(props: TableTfootProps) {
  return <tfoot {...props} />;
}
