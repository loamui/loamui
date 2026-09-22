"use client";

import { CarouselControl } from "../utils/CarouselControl.js";
import type { CarouselControlProps } from "../utils/CarouselControl.js";

export function CarouselPrevious(props: CarouselControlProps) {
  return <CarouselControl direction={-1} part="Carousel.Previous" {...props} />;
}

/** Pages the Track forward by one of its widths; disabled at the end unless `loop`. */
