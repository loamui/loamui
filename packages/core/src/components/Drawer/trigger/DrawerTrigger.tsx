"use client";

import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { dialogTriggerProps, useDialogContext } from "../../../hooks/use-dialog.js";
import type { DialogTriggerRenderProps } from "../../../hooks/use-dialog.js";
import { Button } from "../../Button/Button.js";
import { COMPONENT } from "../root/DrawerRootContext.js";

export interface DrawerTriggerRenderProps extends DialogTriggerRenderProps {}

export interface DrawerTriggerProps extends PartProps<"button"> {
  /**
   * Substitute your own element as the trigger (`render={<MyIconButton />}`);
   * triggers act, so keep them buttons, or pass a function receiving the
   * wiring props. Without it, the Trigger renders a LoamUI Button.
   */
  render?: RenderProp<DrawerTriggerRenderProps>;
}

export function DrawerTrigger({ render, children, ...rest }: DrawerTriggerProps) {
  const ctx = useDialogContext(COMPONENT, "Trigger");
  const triggerProps = dialogTriggerProps(ctx);
  return render ? (
    <>{renderWithProps(render, mergeProps(triggerProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, triggerProps)}</>
  );
}

/** Which edge the panel is anchored to. Logical, so it follows writing mode. */
