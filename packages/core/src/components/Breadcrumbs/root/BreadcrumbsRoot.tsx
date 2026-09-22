import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

/** The words the landmark speaks. */
export interface BreadcrumbsLabels {
  /** The landmark's accessible name. @default "Breadcrumbs" */
  navigation?: string;
}

export interface BreadcrumbsRootProps extends PartProps<"nav"> {
  /** The words the landmark speaks: `navigation` is its accessible name. */
  labels?: BreadcrumbsLabels;
}

/**
 * Shows the path to the current page.
 *
 * ```tsx
 * <Breadcrumbs.Root>
 *   <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
 *   <Breadcrumbs.Item href="/settings">Settings</Breadcrumbs.Item>
 *   <Breadcrumbs.Item current>Billing</Breadcrumbs.Item>
 * </Breadcrumbs.Root>
 * ```
 *
 * Items are links via `href` (the built-in element), plain text when
 * `current`, or any element via `render`, e.g. a router link:
 * `render={<Link href="/settings" />}`. The consumer marks the current page
 * explicitly, so truncated paths ("Home / … / Billing") stay correct.
 * Separators are CSS, drawn from the public `--loam-breadcrumbs-separator`
 * property (a CSS string, `"/"` by default), not DOM.
 */
export function BreadcrumbsRoot({ labels, className, children, ...rest }: BreadcrumbsRootProps) {
  const navigationLabel = labels?.navigation ?? "Breadcrumbs";
  return (
    <nav aria-label={navigationLabel} {...rest} className={cx("loam-Breadcrumbs", className)}>
      <ol>{children}</ol>
    </nav>
  );
}
