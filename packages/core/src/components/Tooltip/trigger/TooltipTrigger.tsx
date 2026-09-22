"use client";

import type { CSSProperties, FocusEvent, PointerEvent as ReactPointerEvent } from "react";
import { Button } from "../../Button/Button.js";
import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useTooltipContext } from "../root/TooltipRootContext.js";

export interface TooltipTriggerRenderProps {
  "aria-describedby": string;
  /** Styling hook — present while the bubble is open. */
  "data-popup-open": "true" | undefined;
  onPointerEnter: (e: ReactPointerEvent<Element>) => void;
  onPointerLeave: (e: ReactPointerEvent<Element>) => void;
  onFocus: (e: FocusEvent<Element>) => void;
  onBlur: (e: FocusEvent<Element>) => void;
  style: CSSProperties;
}

export interface TooltipTriggerProps extends PartProps<"button"> {
  /**
   * Substitute your own interactive element as the trigger
   * (`render={<IconButton />}`) or pass a function receiving the wiring
   * props. Without it, the Trigger renders a LoamUI Button.
   */
  render?: RenderProp<TooltipTriggerRenderProps>;
}

export function TooltipTrigger({ render, children, ...rest }: TooltipTriggerProps) {
  const ctx = useTooltipContext("Tooltip.Trigger");

  const triggerProps: TooltipTriggerRenderProps = {
    "aria-describedby": ctx.bubbleId,
    "data-popup-open": ctx.open ? "true" : undefined,
    onPointerEnter: (e) => ctx.triggerEnter(e),
    onPointerLeave: () => ctx.triggerLeave(),
    onFocus: (e) => ctx.triggerFocus(e),
    onBlur: () => ctx.triggerBlur(),
    style: { anchorName: ctx.anchorName } as CSSProperties,
  };

  return render ? (
    <>{renderWithProps(render, mergeProps(triggerProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, triggerProps)}</>
  );
}
