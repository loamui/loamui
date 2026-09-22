"use client";

import { useMemo } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, Ref } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs, renderWithProps } from "../../../utils/render.js";
import { isRtl, useCarouselContext } from "../root/CarouselRootContext.js";

export interface CarouselTrackProps extends PartProps<"ul"> {}

/** The wiring the Track attaches to its `<ul>`. */
interface CarouselTrackWiring {
  ref: Ref<HTMLUListElement> | undefined;
  tabIndex: number;
  onKeyDown: (e: ReactKeyboardEvent<HTMLUListElement>) => void;
}

/**
 * The scroller: a `ul` laid out as a column grid with inline scroll
 * snapping, in the tab order so a keyboard can reach it. ArrowLeft and
 * ArrowRight page it, Home and End go to the ends; the arrows are left to
 * the browser when focus is on something inside an item.
 */
export function CarouselTrack({ ref, tabIndex = 0, className, ...rest }: CarouselTrackProps) {
  const ctx = useCarouselContext("Carousel.Track");
  const trackRef = useMemo(() => composeRefs(ref, ctx.trackRef), [ref, ctx.trackRef]);
  const { page, goTo, count } = ctx;

  const wiring: CarouselTrackWiring = {
    ref: trackRef,
    tabIndex,
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget || e.defaultPrevented) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const rtl = isRtl(e.currentTarget);
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          page(rtl ? -1 : 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          page(rtl ? 1 : -1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(count - 1);
          break;
      }
    },
  };

  return (
    <>{renderWithProps(<ul role="list" className={cx("track", className)} {...rest} />, wiring)}</>
  );
}

/** The wiring an Item attaches to whatever it renders. */
