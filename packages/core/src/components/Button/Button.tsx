import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";
import { renderWithProps } from "../../utils/render.js";
import type { RenderProp } from "../../utils/render.js";

export interface ButtonProps extends PartProps<"button"> {
  children?: ReactNode;
  /**
   * Render as a different element. The Button's classes and attributes
   * merge onto the element it renders. Not for navigation — a
   * call-to-action that goes somewhere is a `SignpostLink`.
   */
  render?: RenderProp<Record<string, unknown>>;
}

/**
 * The primary way to trigger an action.
 *
 * Intentionally minimal: it renders a native `<button>` and takes children.
 * Appearance is decided by CONTEXT, not props (see the Contextualism guide):
 *
 * ```tsx
 * <Button>Neutral by default</Button>
 * <p style={{ "--loam-context": "primary" }}>
 *   <Button>The main action of this region</Button>
 * </p>
 * <section style={{ "--loam-context": "danger" }}>
 *   <Button>Delete</Button>                                  // danger region
 * </section>
 * ```
 *
 * Size is fluid (container-relative tokens) — there is no size prop, and
 * narrow containers make the button full width automatically. Width is the
 * parent's decision: a grid or stacked-flex region stretches its buttons
 * natively, a row shrink-wraps them. Icons are
 * detected (`:has(svg)`) — compose them as children, no slot props. An
 * icon-only button is detected from its accessible name: give it an
 * `aria-label` or `aria-labelledby` (required for accessibility anyway), or
 * name it with hidden text (`<VisuallyHidden>`)
 * beside the icon, and it becomes square.
 * For a one-off colour set the public `--loam-button-color` property; for a
 * house style, wrap it (the SecondaryButton pattern).
 */
export function Button({ render, type, className, children, ref, ...rest }: ButtonProps) {
  if (render) {
    const buttonTarget =
      typeof render === "function" || typeof render.type !== "string" || render.type === "button";
    return (
      <>
        {renderWithProps(render, {
          ref,
          type: type ?? (buttonTarget ? "button" : undefined),
          className: cx("loam-Button", className),
          children,
          ...rest,
        })}
      </>
    );
  }
  return (
    // type="button" unless overridden: a bare <button> inside a form is a
    // native submit, so "Cancel" buttons would submit the form.
    <button ref={ref} type={type ?? "button"} className={cx("loam-Button", className)} {...rest}>
      {children}
    </button>
  );
}
