import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";

export interface SkipLinkProps extends PartProps<"a"> {
  /** The id of the main content landmark, e.g. `"#content"`. */
  href: string;
}

/**
 * The first focusable element on the page: a link straight to the main
 * content, visible only while focused.
 *
 * ```tsx
 * <body>
 *   <SkipLink href="#content" />
 *   <header>…</header>
 *   <main id="content" tabIndex={-1}>…</main>
 * </body>
 * ```
 *
 * Keyboard and screen-reader users otherwise re-traverse the whole header
 * on every page. Render it before everything else; the target needs the
 * matching `id` (and `<main>` is the right home for it). The label is the
 * children, "Skip to main content" by default.
 */
export function SkipLink({ className, children, ...rest }: SkipLinkProps) {
  const label = children ?? "Skip to main content";
  return (
    <a {...rest} className={cx("loam-SkipLink", className)}>
      {label}
    </a>
  );
}
