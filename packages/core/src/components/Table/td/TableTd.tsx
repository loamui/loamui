import type { PartProps } from "../../../utils/props.js";

export interface TableTdProps extends PartProps<"td"> {}

/** A data cell. For a header cell, reach for `Table.Th`, which can sort. */
export function TableTd(props: TableTdProps) {
  return <td {...props} />;
}
