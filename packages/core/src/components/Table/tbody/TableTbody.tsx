import type { PartProps } from "../../../utils/props.js";

export interface TableTbodyProps extends PartProps<"tbody"> {}

/** The body rows. */
export function TableTbody(props: TableTbodyProps) {
  return <tbody {...props} />;
}
