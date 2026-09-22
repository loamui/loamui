import type { PartProps } from "../../../utils/props.js";

export interface TableTfootProps extends PartProps<"tfoot"> {}

/** The footer rows, for totals and the like. */
export function TableTfoot(props: TableTfootProps) {
  return <tfoot {...props} />;
}
