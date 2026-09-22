"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { Button } from "../../Button/Button.js";
import { usePopoverContext } from "../root/PopoverRootContext.js";

export interface PopoverCloseRenderProps {
  type: "button";
  onClick: (e: ReactMouseEvent<Element>) => void;
}

export interface PopoverCloseProps extends PartProps<"button"> {
  /** Substitute your own element; defaults to a LoamUI Button. */
  render?: RenderProp<PopoverCloseRenderProps>;
}

export function PopoverClose({ render, children, ...rest }: PopoverCloseProps) {
  const ctx = usePopoverContext("Popover.Close");
  const closeProps: PopoverCloseRenderProps = {
    type: "button",
    onClick: () => ctx.setOpen(false),
  };
  return render ? (
    <>{renderWithProps(render, mergeProps(closeProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, closeProps)}</>
  );
}
