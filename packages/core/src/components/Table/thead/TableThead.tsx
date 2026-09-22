import type { PartProps } from "../../../utils/props.js";

export interface TableTheadProps extends PartProps<"thead"> {}

/** The header rows. */
export function TableThead(props: TableTheadProps) {
  return <thead {...props} />;
}
