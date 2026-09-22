"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useToastItem } from "../root/ToastRootContext.js";

export interface ToastTextRenderProps {
  className: string;
}

export interface ToastTitleProps extends PartProps<"div"> {
  /** Substitute the element (`render={<strong />}`). Defaults to a `<div>`. */
  render?: RenderProp<ToastTextRenderProps>;
}

export function ToastTitle({ render, className, children, ...rest }: ToastTitleProps) {
  useToastItem("Toast.Title");
  const wiring: ToastTextRenderProps = { className: cx("title", className) };
  if (render) return <>{renderWithProps(render, { ...rest, ...wiring, children })}</>;
  return (
    <div {...rest} {...wiring}>
      {children}
    </div>
  );
}
