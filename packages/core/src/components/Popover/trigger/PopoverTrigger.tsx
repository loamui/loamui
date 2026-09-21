"use client";

import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { popupTriggerProps } from "../../../hooks/use-popup.js";
import type { PopupTriggerRenderProps } from "../../../hooks/use-popup.js";
import { Button } from "../../Button/Button.js";
import { usePopoverContext } from "../root/PopoverRootContext.js";

export interface PopoverTriggerRenderProps extends PopupTriggerRenderProps {
  "aria-haspopup": "dialog";
}

export interface PopoverTriggerProps extends PartProps<"button"> {
  /**
   * Substitute your own element as the trigger
   * (`render={<a href="…" />}`) or pass a function receiving the wiring
   * props. Without it, the Trigger renders a LoamUI Button.
   */
  render?: RenderProp<PopoverTriggerRenderProps>;
}

export function PopoverTrigger({ render, children, ...rest }: PopoverTriggerProps) {
  const ctx = usePopoverContext("Popover.Trigger");
  const triggerProps: PopoverTriggerRenderProps = {
    ...popupTriggerProps(ctx),
    "aria-haspopup": "dialog",
  };

  return render ? (
    <>{renderWithProps(render, mergeProps(triggerProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, triggerProps)}</>
  );
}
