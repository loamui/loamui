"use client";

import type { ReactNode } from "react";
import type { PartProps } from "../../../utils/props.js";
import { useNav } from "../root/NavRootContext.js";

export interface NavListProps extends PartProps<"ul"> {
  children?: ReactNode;
}

/**
 * An unordered list with no markers, one line per Item. Nest one inside an
 * Item to indent a level, or inside a Group to fold it. Inside a `nav` an
 * unmarked list keeps its list semantics in every browser, so it needs no
 * role.
 */
export function NavList({ className, children, ref, ...rest }: NavListProps) {
  useNav("Nav.List");
  return (
    <ul ref={ref} className={className} {...rest}>
      {children}
    </ul>
  );
}
