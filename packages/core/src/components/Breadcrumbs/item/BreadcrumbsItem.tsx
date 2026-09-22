import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";

/** Wiring the Item attaches to the link it renders. */
export interface BreadcrumbsItemRenderProps {
  "aria-current": "page" | undefined;
  children?: ReactNode;
}

export interface BreadcrumbsItemProps extends PartProps<"li"> {
  href?: string;
  /** Marks this item as the current page (`aria-current="page"`). */
  current?: boolean;
  /**
   * Substitute the built-in link, e.g. a router link:
   * `render={<Link href="/settings" />}`. Defaults to an `<a>` when `href`
   * is given, plain text otherwise. Attributes for the link itself go on
   * the element you render; `className`, `ref` and the rest land on the
   * `<li>`, which carries the part's class.
   */
  render?: RenderProp<BreadcrumbsItemRenderProps>;
}

export function BreadcrumbsItem({
  current,
  render,
  href,
  className,
  children,
  ...rest
}: BreadcrumbsItemProps) {
  const wiring: BreadcrumbsItemRenderProps = {
    "aria-current": current ? "page" : undefined,
    children,
  };

  const content = render ? (
    renderWithProps(render, wiring)
  ) : href !== undefined ? (
    <a href={href} {...wiring}>
      {children}
    </a>
  ) : (
    <span {...wiring}>{children}</span>
  );

  return (
    <li
      {...rest}
      className={cx("loam-Breadcrumbs-item", className)}
      data-current={current || undefined}
    >
      {content}
    </li>
  );
}
