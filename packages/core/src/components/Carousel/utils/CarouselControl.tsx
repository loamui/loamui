"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { cx } from "../../../utils/cx.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { Button } from "../../Button/Button.js";
import type { ButtonProps } from "../../Button/Button.js";
import { useCarouselContext } from "../root/CarouselRootContext.js";

export interface CarouselControlRenderProps {
  type: "button";
  /** The name from `labels`, unless children name the button. */
  "aria-label": string | undefined;
  /** At an end without `loop`. The button keeps focus, so a reader is not dropped. */
  "aria-disabled": true | undefined;
  onClick: (e: ReactMouseEvent<Element>) => void;
}

export interface CarouselControlProps extends Omit<ButtonProps, "render"> {
  /**
   * Substitute your own element, or pass a function receiving the wiring
   * props. Without it, the part renders a LoamUI Button with a chevron
   * that points toward the start (Previous) or the end (Next) of the
   * track in either writing direction, named by `labels`.
   */
  render?: RenderProp<CarouselControlRenderProps>;
}

function ChevronIcon({ direction }: { direction: -1 | 1 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points={direction === -1 ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

export function CarouselControl({
  direction,
  part,
  render,
  className,
  children,
  ...rest
}: CarouselControlProps & { direction: -1 | 1; part: string }) {
  const ctx = useCarouselContext(part);
  const disabled = !ctx.loop && (direction === -1 ? ctx.atStart : ctx.atEnd);
  const label = direction === -1 ? ctx.labels.previous : ctx.labels.next;

  const wiring: CarouselControlRenderProps = {
    type: "button",
    "aria-label": children == null ? label : undefined,
    "aria-disabled": disabled || undefined,
    onClick: () => {
      if (!disabled) ctx.page(direction);
    },
  };

  return render ? (
    <>{renderWithProps(render, mergeProps(wiring, { className, children, ...rest }))}</>
  ) : (
    <>
      {renderWithProps(
        <Button {...rest} className={cx("loam-Carousel-control", className)}>
          {children ?? <ChevronIcon direction={direction} />}
        </Button>,
        wiring,
      )}
    </>
  );
}

/** Pages the Track back by one of its widths; disabled at the start unless `loop`. */
