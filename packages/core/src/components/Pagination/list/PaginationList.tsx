import type { PartProps } from "../../../utils/props.js";

export interface PaginationListProps extends PartProps<"ul"> {}

export function PaginationList({ className, children, ...rest }: PaginationListProps) {
  return (
    <ul {...rest} className={className}>
      {children}
    </ul>
  );
}
