import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";

export interface SeparatorProps extends PartProps<"hr"> {
  /**
   * Vertical separators divide items in a row (toolbars, inline lists).
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
}

/**
 * A rule between groups of content.
 *
 * Renders a real `<hr>`, the platform's separator role — no ARIA needed for
 * the horizontal form; the vertical form adds `aria-orientation`. Purely
 * visual dividers between unrelated layout areas can often just be a border
 * on the region instead; reach for Separator when the division is *content*
 * (it is announced to assistive technology as a separator).
 */
export function Separator({ orientation = "horizontal", className, ref, ...rest }: SeparatorProps) {
  return (
    <hr
      ref={ref}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      data-orientation={orientation}
      className={cx("loam-Separator", className)}
      {...rest}
    />
  );
}
