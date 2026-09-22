"use client";

import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { dialogCloseProps, useDialogContext } from "../../../hooks/use-dialog.js";
import type { DialogCloseRenderProps } from "../../../hooks/use-dialog.js";
import { Button } from "../../Button/Button.js";
import { COMPONENT } from "../root/ModalRootContext.js";

export interface ModalCloseRenderProps extends DialogCloseRenderProps {}

export interface ModalCloseProps extends PartProps<"button"> {
  /** Substitute your own element; defaults to a LoamUI Button. */
  render?: RenderProp<ModalCloseRenderProps>;
}

export function ModalClose({ render, children, ...rest }: ModalCloseProps) {
  const ctx = useDialogContext(COMPONENT, "Close");
  const closeProps = dialogCloseProps(ctx);
  return render ? (
    <>{renderWithProps(render, mergeProps(closeProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, closeProps)}</>
  );
}
