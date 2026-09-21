"use client";

import { useNav } from "../root/NavRootContext.js";
import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";

export type NavCurrent = boolean | "page" | "step" | "location" | "date" | "time";

/** Wiring the Link attaches to the element it renders. */
export interface NavLinkRenderProps {
  className: string;
  href: string | undefined;
  "aria-current": Exclude<NavCurrent, boolean> | undefined;
  children?: ReactNode;
}

export interface NavLinkProps extends PartProps<"a"> {
  /**
   * Marks the destination the reader is at: `true` for the current page
   * (`aria-current="page"`), `"location"` for the section in view of a
   * table of contents, or another `aria-current` token.
   */
  current?: NavCurrent;
  /**
   * Substitute the built-in `<a>` with a router's link:
   * `render={<Link href="/projects" />}`. The element receives the wiring
   * (`aria-current`, the part's class) and the Link's other props; its own
   * props win over `href`.
   */
  render?: RenderProp<NavLinkRenderProps & Record<string, unknown>>;
  /** The link's text, with an optional `svg` icon before it. */
  children?: ReactNode;
}

/**
 * A destination: an `<a href>`, or any element through `render`. `current`
 * sets `aria-current` and the stylesheet marks the line from that same
 * attribute. An `svg` child is an icon, sized on the text; keep it
 * `aria-hidden` so the link is named by its words.
 */
export function NavLink({ current, render, href, className, children, ...rest }: NavLinkProps) {
  useNav("Nav.Link");
  const wiring: NavLinkRenderProps = {
    className: cx("link", className),
    href,
    "aria-current": current === true ? "page" : current || undefined,
    children,
  };
  if (render) return <>{renderWithProps(render, { ...rest, ...wiring })}</>;
  return (
    <a {...rest} {...wiring}>
      {children}
    </a>
  );
}
