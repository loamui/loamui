import type { PartProps } from "../../../utils/props.js";
import type { RenderProp } from "../../../utils/render.js";
import { Button } from "../../Button/Button.js";
import type { ButtonProps } from "../../Button/Button.js";

export interface PaginationLinkRenderProps {
  /** The current page, detected by the stylesheet as well. */
  "aria-current": "page" | undefined;
  /** An unavailable direction: a placeholder outside the tab and reading order. */
  "aria-hidden": true | undefined;
  "data-disabled": true | undefined;
  tabIndex: -1 | undefined;
}

export interface PaginationLinkProps extends PartProps<"a"> {
  /** Marks the current page (`aria-current="page"`). */
  current?: boolean;
  /**
   * An unavailable destination (Previous on the first page). The built-in
   * link drops its `href` and leaves the tab and accessibility order, so
   * the layout stays stable without an inert stop.
   */
  disabled?: boolean;
  /**
   * Substitute your own link (`render={<Link href="…" />}`); it receives the
   * Button's class and the pagination wiring. Defaults to an `<a>`.
   */
  render?: RenderProp<PaginationLinkRenderProps & Record<string, unknown>>;
}

/** A page destination: a LoamUI Button rendered as a link. */
export function PaginationLink({
  current,
  disabled,
  render,
  href,
  children,
  ...rest
}: PaginationLinkProps) {
  const wiring: PaginationLinkRenderProps = {
    "aria-current": current ? "page" : undefined,
    "aria-hidden": disabled || undefined,
    "data-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : undefined,
  };
  // The anchor's attributes ride through Button's render path untouched;
  // the cast only reconciles the two elements' prop types.
  return (
    <Button
      {...(rest as ButtonProps)}
      {...wiring}
      render={
        (render as ButtonProps["render"]) ?? <a href={disabled ? undefined : href}>{children}</a>
      }
    >
      {children}
    </Button>
  );
}
