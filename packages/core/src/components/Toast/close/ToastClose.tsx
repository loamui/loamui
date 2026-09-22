"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { Button } from "../../Button/Button.js";
import { useToastContext } from "../provider/ToastProviderContext.js";
import { useToastItem } from "../root/ToastRootContext.js";

export interface ToastCloseRenderProps {
  type: "button";
  "aria-label": string;
  onClick: (e: ReactMouseEvent<Element>) => void;
}

/** The words the Close part speaks. */
export interface ToastCloseLabels {
  /** The button's accessible name. @default "Dismiss notification" */
  dismiss?: string;
}

export interface ToastCloseProps extends PartProps<"button"> {
  /** The words the button speaks: `dismiss` is its accessible name. */
  labels?: ToastCloseLabels;
  /** Substitute your own element; defaults to a LoamUI Button. */
  render?: RenderProp<ToastCloseRenderProps>;
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ToastClose({ labels, render, children, ...rest }: ToastCloseProps) {
  const ctx = useToastContext("Toast.Close");
  const toast = useToastItem("Toast.Close");
  const closeProps: ToastCloseRenderProps = {
    type: "button",
    "aria-label": labels?.dismiss ?? "Dismiss notification",
    onClick: () => ctx.close(toast.id),
  };
  const content = children ?? <CrossIcon />;
  return render ? (
    <>{renderWithProps(render, mergeProps(closeProps, { children: content, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{content}</Button>, closeProps)}</>
  );
}

/** The words the ready-made viewport speaks: the landmark's, then each Close's. */
