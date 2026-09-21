"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import type { ReactNode } from "react";
import { useNav } from "../root/NavRootContext.js";

export interface NavGroupTitleProps extends PartProps<"summary"> {
  /** The group's name, with an optional `svg` icon before it. */
  children?: ReactNode;
}

/** The group's always-visible line, a `summary` set like the links around it, with a chevron at its end. */
export function NavGroupTitle({ className, children, ref, ...rest }: NavGroupTitleProps) {
  useNav("Nav.GroupTitle");
  return (
    <summary ref={ref} className={cx("group-title", className)} {...rest}>
      {children}
    </summary>
  );
}
