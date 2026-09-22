"use client";

import type { ReactNode } from "react";
import { useNav } from "../root/NavRootContext.js";
import { createContext } from "react";

import type { PartProps } from "../../../utils/props.js";

export interface NavItemProps extends PartProps<"li"> {
  /** A Link or a Group; then an optional nested List. */
  children?: ReactNode;
}

export const NavItemContext = createContext(false);

export function NavItem({ className, children, ref, ...rest }: NavItemProps) {
  useNav("Nav.Item");
  return (
    <NavItemContext value>
      <li ref={ref} className={className} {...rest}>
        {children}
      </li>
    </NavItemContext>
  );
}

/** What `aria-current` can say: `true` is `"page"`. */
