import type { PartProps } from "../../../utils/props.js";

export interface TableTrProps extends PartProps<"tr"> {}

export function TableTr(props: TableTrProps) {
  return <tr {...props} />;
}
