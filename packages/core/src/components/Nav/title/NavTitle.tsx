"use client";

import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useNamePart } from "../../../hooks/use-naming.js";
import { useNav } from "../root/NavRootContext.js";

export interface NavTitleProps extends PartProps<"p"> {
  /**
   * Render the title as a heading where the nav belongs in the page's
   * outline: `render={<h2 />}`. A paragraph by default, so a nav's label
   * never enters the outline uninvited.
   */
  render?: RenderProp<Record<string, unknown>>;
  children?: ReactNode;
}

/** A small label above the lists. It carries the id that names the nav. */
export function NavTitle({ render, className, children, ref, id, ...rest }: NavTitleProps) {
  const resolvedId = useNamePart(useNav("Nav.Title"), id);
  const props = { ref, id: resolvedId, className: cx("title", className), ...rest };
  if (render) return <>{renderWithProps(render, { ...props, children })}</>;
  return <p {...props}>{children}</p>;
}
