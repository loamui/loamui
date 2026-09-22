"use client";

import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { dialogTriggerProps, useDialogContext } from "../../../hooks/use-dialog.js";
import type { DialogTriggerRenderProps } from "../../../hooks/use-dialog.js";
import { Button } from "../../Button/Button.js";
import { COMPONENT } from "../root/ModalRootContext.js";

export interface ModalTriggerRenderProps extends DialogTriggerRenderProps {}

export interface ModalTriggerProps extends PartProps<"button"> {
  /**
   * Substitute your own element as the trigger (`render={<MyIconButton />}`);
   * triggers act, so keep them buttons, or pass a function receiving the
   * wiring props. Without it, the Trigger renders a LoamUI Button.
   */
  render?: RenderProp<ModalTriggerRenderProps>;
}

export function ModalTrigger({ render, children, ...rest }: ModalTriggerProps) {
  const ctx = useDialogContext(COMPONENT, "Trigger");
  const triggerProps = dialogTriggerProps(ctx);
  return render ? (
    <>{renderWithProps(render, mergeProps(triggerProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, triggerProps)}</>
  );
}
