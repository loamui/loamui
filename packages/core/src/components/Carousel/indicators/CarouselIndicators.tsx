"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useCarouselContext } from "../root/CarouselRootContext.js";

export interface CarouselIndicatorsProps extends PartProps<"ul"> {}

/**
 * One button per item, named by `labels.indicator`, the current one
 * marked with `aria-current`. A click scrolls that item to the start of
 * the Track.
 */
export function CarouselIndicators({ className, ...rest }: CarouselIndicatorsProps) {
  const ctx = useCarouselContext("Carousel.Indicators");
  const id = useId();
  const dots: ReactNode[] = [];
  for (let i = 0; i < ctx.count; i += 1) {
    dots.push(
      <li key={`${id}-${i}`}>
        <button
          type="button"
          aria-label={ctx.labels.indicator(i + 1, ctx.count)}
          aria-current={ctx.active === i || undefined}
          onClick={() => ctx.goTo(i)}
        />
      </li>,
    );
  }
  return (
    // list-style: none drops list semantics in WebKit; the role keeps "5 items".
    <ul role="list" className={cx("indicators", className)} {...rest}>
      {dots}
    </ul>
  );
}
