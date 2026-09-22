"use client";

import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { dialogCloseProps, useDialogContext } from "../../../hooks/use-dialog.js";
import type { DialogCloseRenderProps } from "../../../hooks/use-dialog.js";
import { Button } from "../../Button/Button.js";
import { COMPONENT } from "../root/DrawerRootContext.js";

export interface DrawerCloseRenderProps extends DialogCloseRenderProps {}

export interface DrawerCloseProps extends PartProps<"button"> {
  /** Substitute your own element; defaults to a LoamUI Button. */
  render?: RenderProp<DrawerCloseRenderProps>;
}

export function DrawerClose({ render, children, ...rest }: DrawerCloseProps) {
  const ctx = useDialogContext(COMPONENT, "Close");
  const closeProps = dialogCloseProps(ctx);
  return render ? (
    <>{renderWithProps(render, mergeProps(closeProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, closeProps)}</>
  );
}
