import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";
import { renderWithProps } from "../../utils/render.js";
import type { RenderProp } from "../../utils/render.js";

export interface SignpostLinkProps extends PartProps<"a"> {
  /** The label. It is wrapped in the arrow anatomy whatever element renders. */
  children?: ReactNode;
  /**
   * Substitute the built-in `<a>` — e.g. a router link:
   * `render={<Link href="/apply" />}`. The label stays on SignpostLink (the
   * arrow anatomy becomes the element's children); an element with children
   * of its own keeps them, per the merge contract, and so bypasses the arrow.
   */
  render?: RenderProp<Record<string, unknown>>;
}

function anatomy(label: ReactNode) {
  return (
    <>
      <span className="icon" aria-hidden>
        <svg viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="label">{label}</span>
    </>
  );
}

/**
 * A prominent navigational link: the signpost to a task's starting point.
 *
 * ```tsx
 * <SignpostLink href="/apply">Start your application</SignpostLink>
 * ```
 *
 * It is a real `<a>` — navigation, never an action. Where a design wants a
 * button-sized call-to-action that goes somewhere, this is the component;
 * a `Button` is for doing, not going. The arrow is decoration
 * (`aria-hidden`), so assistive technology hears only the label and the
 * link role.
 */
export function SignpostLink({ render, className, children, ref, ...rest }: SignpostLinkProps) {
  const wiring = { ref, className: cx("loam-SignpostLink", className), ...rest };
  if (render) {
    return <>{renderWithProps(render, { ...wiring, children: anatomy(children) })}</>;
  }
  return <a {...wiring}>{anatomy(children)}</a>;
}
