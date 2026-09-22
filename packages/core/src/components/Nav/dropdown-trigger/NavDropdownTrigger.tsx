"use client";

import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode, Ref } from "react";
import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useDropdown } from "../dropdown/NavDropdownContext.js";

export interface NavDropdownTriggerRenderProps {
  type: "button";
  className: string;
  "aria-expanded": boolean;
  "aria-controls": string;
  /** The older declarative route: the button invokes the panel's popover. */
  popoverTarget: string;
  /** The current declarative route (`command="toggle-popover"`). */
  commandfor: string;
  command: "toggle-popover";
  /** Styling hook: present while the panel is open. */
  "data-popup-open": "true" | undefined;
  style: CSSProperties;
  onClick: (event: ReactMouseEvent<Element>) => void;
  ref: Ref<HTMLButtonElement>;
  children?: ReactNode;
}

export interface NavDropdownTriggerProps extends PartProps<"button"> {
  /**
   * Substitute the built-in `<button>`; the element receives the wiring
   * (the part's classes, `aria-expanded`, the popover invocation) and the
   * Trigger's other props.
   */
  render?: RenderProp<NavDropdownTriggerRenderProps>;
  /** The visible label, with an optional `svg` icon before it. */
  children?: ReactNode;
}

/**
 * The line that opens the panel: a `button` carrying the link class, so
 * the stylesheet sets it like the links beside it, with a chevron drawn at
 * its end that turns while the panel is open. It invokes the panel
 * declaratively (`commandfor` where the browser has commands, else
 * `popovertarget`), and toggles it itself where it has neither; either
 * way `aria-expanded` follows the panel's own toggle event.
 */
export function NavDropdownTrigger({ render, children, ...rest }: NavDropdownTriggerProps) {
  const ctx = useDropdown("Nav.DropdownTrigger");
  const wiring: NavDropdownTriggerRenderProps = {
    ref: ctx.triggerRef,
    type: "button",
    className: "link dropdown-trigger",
    "aria-expanded": ctx.open,
    "aria-controls": ctx.popupId,
    popoverTarget: ctx.popupId,
    commandfor: ctx.popupId,
    command: "toggle-popover",
    "data-popup-open": ctx.open ? "true" : undefined,
    style: { anchorName: ctx.anchorName } as CSSProperties,
    onClick: () => {
      // Native invocation toggles the panel when enhanced; the toggle
      // event syncs it back into state.
      if (!ctx.enhanced) ctx.setOpen(!ctx.open);
    },
    children,
  };
  if (render) return <>{renderWithProps(render, mergeProps(wiring, rest))}</>;
  return <button {...mergeProps(wiring, rest)} />;
}
