"use client";

import { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { composeRefs } from "../../../utils/render.js";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { usePopup } from "../../../hooks/use-popup.js";
import { useDropdown } from "../dropdown/NavDropdownContext.js";

export interface NavDropdownPanelProps extends PartProps<"div"> {
  /** A List of Items and Links; a wide panel is your own grid around them. */
  children?: ReactNode;
}

/**
 * The panel: a `div` with `popover="auto"`, anchored under the trigger's
 * start edge and flipped by the browser when it would leave the viewport.
 * Its width is the public `--loam-nav-dropdown-size` (16rem), capped to the
 * viewport. In a browser without anchor positioning the same element is an
 * absolutely positioned panel under the Item, dismissed by the component.
 * The popup engine is Popover's; nothing moves on open, because a
 * disclosure leaves focus on its button and Tab reaches the first link
 * from there.
 */
export function NavDropdownPanel({
  className,
  style,
  children,
  ref: refProp,
  ...rest
}: NavDropdownPanelProps) {
  const ctx = useDropdown("Nav.DropdownPanel");
  const composedRef = useMemo(() => composeRefs(refProp, ctx.popupRef), [refProp, ctx.popupRef]);
  usePopup(ctx, { focusOnOpen: false });
  return (
    // rest cannot override what follows: the id, popover and anchor wiring
    // are what make the panel a popover at all.
    <div
      {...rest}
      id={ctx.popupId}
      popover={ctx.enhanced ? "auto" : undefined}
      hidden={ctx.enhanced || ctx.open ? undefined : true}
      data-open={ctx.open || undefined}
      style={{ ...style, positionAnchor: ctx.anchorName } as CSSProperties}
      ref={composedRef}
      className={cx("loam-Nav-dropdown", className)}
    >
      {children}
    </div>
  );
}
