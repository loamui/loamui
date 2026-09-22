import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";
import { renderWithProps } from "../../utils/render.js";
import type { RenderProp } from "../../utils/render.js";

export interface VisuallyHiddenProps extends PartProps<"span"> {
  /**
   * Render as a different element: `render={<legend />}` for a legend the
   * design hides, `render={<label />}` for a label a placeholder stands in
   * for visually. The class and attributes merge onto the element it renders.
   */
  render?: RenderProp<Record<string, unknown>>;
  children?: ReactNode;
}

/**
 * Text for assistive technology alone: the "Error: " before a message, the
 * name of an icon-only control, a label the design hides.
 *
 * ```tsx
 * <button>
 *   <TrashIcon aria-hidden />
 *   <VisuallyHidden>Delete this row</VisuallyHidden>
 * </button>
 * ```
 *
 * Real text, not an `aria-label`: it translates with the page, it survives
 * reader mode, and a machine translation reaches it. Reach for it when a
 * control's name is carried by a glyph, when a repeated action needs the
 * thing it acts on ("Remove *Climbing bean seeds*"), or when a table's last
 * column header has no words to show. Do not use it to hide something every
 * reader needs: content that is hidden from the eye is still in the tab order
 * for its links and controls, and a sighted keyboard user will land on them.
 *
 * The element is a `<span>`, so it is phrasing content and safe inside a
 * button, a label or a heading; `render` swaps it where the slot needs a
 * different element.
 */
export function VisuallyHidden({ render, className, children, ref, ...rest }: VisuallyHiddenProps) {
  const wiring = {
    ref,
    className: cx("loam-VisuallyHidden", className),
    children,
    ...rest,
  };
  if (render) {
    return <>{renderWithProps(render, wiring)}</>;
  }
  return <span {...wiring} />;
}
