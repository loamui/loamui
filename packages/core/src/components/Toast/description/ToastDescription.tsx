"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import type { ToastTextRenderProps } from "../title/ToastTitle.js";
import { useToastItem } from "../root/ToastRootContext.js";

export interface ToastDescriptionProps extends PartProps<"div"> {
  /** Substitute the element (`render={<p />}`). Defaults to a `<div>`. */
  render?: RenderProp<ToastTextRenderProps>;
}

export function ToastDescription({ render, className, children, ...rest }: ToastDescriptionProps) {
  useToastItem("Toast.Description");
  const wiring: ToastTextRenderProps = { className: cx("description", className) };
  if (render) return <>{renderWithProps(render, { ...rest, ...wiring, children })}</>;
  return (
    <div {...rest} {...wiring}>
      {children}
    </div>
  );
}

/** Wiring the Action attaches to whatever it renders. */
