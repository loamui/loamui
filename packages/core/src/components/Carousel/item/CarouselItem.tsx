"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ReactNode, Ref } from "react";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs, mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useCarouselContext } from "../root/CarouselRootContext.js";

export interface CarouselItemRenderProps {
  ref: Ref<HTMLLIElement> | undefined;
  className?: string;
  children?: ReactNode;
}

export interface CarouselItemProps extends PartProps<"li"> {
  /** Substitute your own element; it receives the wiring props. Defaults to an `<li>`. */
  render?: RenderProp<CarouselItemRenderProps>;
}

/** One item, a snap point that hosts your content: a Card, an image, a figure, a quote. */
export function CarouselItem({ render, className, children, ref, ...rest }: CarouselItemProps) {
  const ctx = useCarouselContext("Carousel.Item");
  const ownRef = useRef<HTMLLIElement | null>(null);
  const itemRef = useMemo(() => composeRefs(ref, ownRef), [ref]);
  const { register } = ctx;

  // An effect, not a ref callback: the observer's root is the Track, whose
  // ref attaches after its items' refs, so registering on attach would
  // find no root to observe in.
  useEffect(() => {
    const el = ownRef.current;
    if (!el) return;
    return register(el);
  }, [register]);

  const wiring: CarouselItemRenderProps = { ref: itemRef, className, children };

  return (
    <>
      {render
        ? renderWithProps(render, mergeProps(wiring, rest))
        : renderWithProps(<li {...rest} />, wiring)}
    </>
  );
}

/** The wiring Previous and Next attach to whatever they render. */
