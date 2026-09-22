import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface PaginationEllipsisProps extends PartProps<"li"> {}

/** A gap in the page list; visual shorthand, hidden from assistive technology. */
export function PaginationEllipsis({ className, children, ...rest }: PaginationEllipsisProps) {
  const glyph = children ?? "…";
  return (
    <li aria-hidden="true" {...rest} className={cx("ellipsis", className)}>
      {glyph}
    </li>
  );
}
