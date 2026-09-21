"use client";

import { CarouselControl } from "../utils/CarouselControl.js";
import type { CarouselControlProps } from "../utils/CarouselControl.js";

export function CarouselNext(props: CarouselControlProps) {
  return <CarouselControl direction={1} part="Carousel.Next" {...props} />;
}
