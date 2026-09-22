"use client";

import { use } from "react";
import type { ReactNode } from "react";
import { useNav } from "../root/NavRootContext.js";
import { NavItemContext } from "../item/NavItem.js";
import { usePopupRoot } from "../../../hooks/use-popup.js";
import type { OpenStateOptions } from "../../../hooks/use-popup.js";
import { NavDropdownContext } from "./NavDropdownContext.js";

export interface NavDropdownProps extends OpenStateOptions {
  /** A DropdownTrigger, then a DropdownPanel, side by side. */
  children?: ReactNode;
}

/**
 * A dropdown of links opened from a line of the nav: a disclosure, not a
 * menu. The Trigger is a button reporting `aria-expanded`; the Panel is a
 * native popover holding ordinary links, so the browser gives it the top
 * layer, light dismiss and Escape, and Tab walks the links as it walks
 * any others. Opens on click only, never on hover. Renders no element of
 * its own: the Item is the wrapper, and the two parts sit in it in order.
 * `open`, `defaultOpen` and `onOpenChange` follow the library's
 * controlled-or-not contract.
 */
export function NavDropdown({ open, defaultOpen, onOpenChange, children }: NavDropdownProps) {
  useNav("Nav.Dropdown");
  if (!use(NavItemContext)) {
    throw new Error("Nav.Dropdown must be rendered inside <Nav.Item>.");
  }
  const popup = usePopupRoot("dropdown", { open, defaultOpen, onOpenChange });
  return <NavDropdownContext value={popup}>{children}</NavDropdownContext>;
}

/** Wiring the DropdownTrigger attaches to whatever it renders. */
