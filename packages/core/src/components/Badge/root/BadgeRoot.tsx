import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { LoamUISize, PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";

export interface BadgeRootProps extends Omit<PartProps<"span">, "color"> {
  /** Control size. @default "md" */
  size?: LoamUISize;
  /**
   * Render as a different element: `render={<a href="…" />}` for a badge
   * that is a link (a tag in a tag list). The Badge's class and attributes
   * merge onto the element it renders.
   */
  render?: RenderProp<Record<string, unknown>>;
  children?: ReactNode;
}

/**
 * A compact pill for statuses, counts, and labels.
 *
 * Neutral by default; a --loam-context region colours it. Declare
 * `--loam-context` on a region (an ancestor — a style query never matches
 * the element that declares it, so a one-element region is a wrapper) and
 * the pill's tint and text derive from that status's colour.
 *
 * The label goes in `Badge.Text`, so anything beside it is composed on either
 * side and the markup says which: an icon before the words, a count after
 * them. Icons are detected children — there are no slot props:
 *
 * ```tsx
 * <Badge.Root>
 *   <CheckIcon />
 *   <Badge.Text>Shipped</Badge.Text>
 * </Badge.Root>
 * ```
 */
export function BadgeRoot({
  size = "md",
  render,
  className,
  children,
  ref,
  ...rest
}: BadgeRootProps) {
  const wiring = {
    ref,
    className: cx("loam-Badge", className),
    "data-size": size,
    children,
    ...rest,
  };
  if (render) {
    return <>{renderWithProps(render, wiring)}</>;
  }
  return <span {...wiring} />;
}
