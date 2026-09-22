import type { PartProps } from "../../../utils/props.js";

export interface PaginationItemProps extends PartProps<"li"> {}

export function PaginationItem({ className, children, ...rest }: PaginationItemProps) {
  return (
    <li {...rest} className={className}>
      {children}
    </li>
  );
}

/** Wiring the Link attaches to whatever it renders. */
