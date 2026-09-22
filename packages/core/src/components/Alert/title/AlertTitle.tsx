import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";

export interface AlertTitleProps extends PartProps<"div"> {
  /**
   * Render as a different element: `render={<h2 />}` where the alert's title
   * belongs in the page outline. The class merges onto the element it renders.
   */
  render?: RenderProp<Record<string, unknown>>;
}

export function AlertTitle({ render, className, children, ref, ...rest }: AlertTitleProps) {
  const wiring = { ref, className: cx("title", className), children, ...rest };
  if (render) {
    return <>{renderWithProps(render, wiring)}</>;
  }
  return <div {...wiring} />;
}
