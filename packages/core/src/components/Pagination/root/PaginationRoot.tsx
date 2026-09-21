import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

/**
 * Link-first page navigation, composed from parts.
 *
 * Every destination is a real link (a LoamUI Button rendered as an `<a>`),
 * so a page is linkable, survives reloads and works before JavaScript runs;
 * client routers substitute their own link through `render` or intercept
 * `onNavigate`. The current page carries `aria-current="page"` and the
 * stylesheet keys off that same attribute.
 *
 * ```tsx
 * <Pagination.Root>
 *   <Pagination.List>
 *     <Pagination.Pages page={page} count={20} getHref={(n) => `?page=${n}`} />
 *   </Pagination.List>
 * </Pagination.Root>
 * ```
 *
 * `Pagination.Pages` renders Previous, the numbered window with its
 * ellipses, and Next. Edge links (first, last) are your own Items around it.
 */

/** The words the landmark speaks. */
export interface PaginationLabels {
  /** The landmark's accessible name. @default "Pagination" */
  navigation?: string;
}

export interface PaginationRootProps extends PartProps<"nav"> {
  /** The words the landmark speaks: `navigation` is its accessible name. */
  labels?: PaginationLabels;
}

export function PaginationRoot({ labels, className, children, ...rest }: PaginationRootProps) {
  const navigationLabel = labels?.navigation ?? "Pagination";
  return (
    <nav aria-label={navigationLabel} {...rest} className={cx("loam-Pagination", className)}>
      {children}
    </nav>
  );
}
