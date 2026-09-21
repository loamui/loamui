"use client";

import { useEffect } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { usePopoverContext } from "../root/PopoverRootContext.js";

export interface PopoverTitleRenderProps {
  id: string;
  className: string;
}

export interface PopoverTitleProps extends PartProps<"h2"> {
  /**
   * Substitute the heading element so its level follows the page
   * (`render={<h3 />}`). Defaults to an `<h2>`.
   */
  render?: RenderProp<PopoverTitleRenderProps>;
}

export function PopoverTitle({ render, className, children, ...rest }: PopoverTitleProps) {
  const ctx = usePopoverContext("Popover.Title");
  const { registerTitle } = ctx;
  useEffect(() => registerTitle(), [registerTitle]);
  const wiring: PopoverTitleRenderProps = { id: ctx.titleId, className: cx("title", className) };
  if (render) {
    return <>{renderWithProps(render, { ...rest, ...wiring, children })}</>;
  }
  return (
    <h2 {...rest} {...wiring}>
      {children}
    </h2>
  );
}
