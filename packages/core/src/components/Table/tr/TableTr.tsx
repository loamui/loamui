// No "use client": a pass-through over the native element the Table's scope
// already styles. It names the anatomy — every element the scope paints is
// reachable as a part — rather than re-implementing the table.
import type { PartProps } from "../../../utils/props.js";

export interface TableTrProps extends PartProps<"tr"> {}

/** A row. */
export function TableTr(props: TableTrProps) {
  return <tr {...props} />;
}
