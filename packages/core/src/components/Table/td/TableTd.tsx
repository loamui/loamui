// No "use client": a pass-through over the native element the Table's scope
// already styles. It names the anatomy — every element the scope paints is
// reachable as a part — rather than re-implementing the table.
import type { PartProps } from "../../../utils/props.js";

export interface TableTdProps extends PartProps<"td"> {}

/** A data cell. For a header cell, reach for `Table.Th`, which can sort. */
export function TableTd(props: TableTdProps) {
  return <td {...props} />;
}
