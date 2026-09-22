"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { Button } from "../../Button/Button.js";
import { useToastContext } from "../provider/ToastProviderContext.js";
import { useToastItem } from "../root/ToastRootContext.js";

export interface ToastActionRenderProps {
  type: "button";
  onClick: (e: ReactMouseEvent<Element>) => void;
}

export interface ToastActionProps extends PartProps<"button"> {
  /** Runs before the toast dismisses. */
  onAction?: () => void;
  /** Substitute your own element; defaults to a LoamUI Button. */
  render?: RenderProp<ToastActionRenderProps>;
}

export function ToastAction({ onAction, render, children, ...rest }: ToastActionProps) {
  const ctx = useToastContext("Toast.Action");
  const toast = useToastItem("Toast.Action");
  const actionProps: ToastActionRenderProps = {
    type: "button",
    onClick: () => {
      onAction?.();
      ctx.close(toast.id);
    },
  };
  return render ? (
    <>{renderWithProps(render, mergeProps(actionProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, actionProps)}</>
  );
}

/** Wiring the Close part attaches to whatever it renders. */
