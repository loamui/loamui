"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import {
  AT_REST,
  CarouselContext,
  FULL,
  HALF,
  NO_LABELS,
  SETTLE_MS,
  defaultIndicator,
  defaultStatus,
  inDocumentOrder,
  isRtl,
} from "./CarouselRootContext.js";
import type { CarouselContextValue, CarouselLabels, Position } from "./CarouselRootContext.js";

/**
 * A carousel: a scroll-snap track of items with buttons that page it,
 * indicators that jump to an item, and a live status, composed from parts.
 *
 * The Track is an ordinary scroller, so it works with a wheel, a swipe, a
 * keyboard and no JavaScript; the parts around it add paging, position
 * and announcement on top of native scrolling rather than replacing it.
 * Which item is current is read from the scroll position with an
 * IntersectionObserver, so Indicators, Previous, Next and the status follow
 * a swipe as faithfully as a click. Nothing advances on its own.
 *
 * ```tsx
 * <Carousel.Root aria-labelledby="guides">
 *   <h2 id="guides">Guides</h2>
 *   <Carousel.Track>
 *     <Carousel.Item>…</Carousel.Item>
 *     <Carousel.Item>…</Carousel.Item>
 *   </Carousel.Track>
 *   <div className="row">
 *     <Carousel.Previous />
 *     <Carousel.Next />
 *   </div>
 *   <Carousel.Indicators />
 * </Carousel.Root>
 * ```
 */
export interface CarouselRootProps extends PartProps<"section"> {
  /** At either end, Previous and Next wrap around instead of disabling. */
  loop?: boolean;
  labels?: CarouselLabels;
}

export function CarouselRoot({
  loop = false,
  labels: {
    region = "Carousel",
    previous = "Previous",
    next = "Next",
    indicator = defaultIndicator,
    status: statusLabel = defaultStatus,
  } = NO_LABELS,
  className,
  children,
  ...rest
}: CarouselRootProps) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const itemsRef = useRef<HTMLElement[]>([]);
  const ratiosRef = useRef(new Map<Element, number>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [count, setCount] = useState(0);
  const [position, setPosition] = useState<Position>(AT_REST);
  const [measured, setMeasured] = useState(false);
  const [status, setStatus] = useState("");
  const positionRef = useRef(position);
  positionRef.current = position;

  const measure = useCallback(() => {
    const items = itemsRef.current;
    if (items.length === 0) return;
    const ratio = (el: Element) => ratiosRef.current.get(el) ?? 0;
    let active = items.findIndex((el) => ratio(el) >= HALF);
    if (active < 0) {
      active = items.reduce((best, el, i) => (ratio(el) > ratio(items[best]!) ? i : best), 0);
    }
    setPosition({
      active,
      atStart: ratio(items[0]!) >= FULL,
      atEnd: ratio(items[items.length - 1]!) >= FULL,
    });
    setMeasured(true);
  }, []);

  const register = useCallback(
    (item: HTMLElement) => {
      itemsRef.current = inDocumentOrder([...itemsRef.current, item]);
      setCount(itemsRef.current.length);
      // Created on the first Item, once the Track it scrolls in has a node.
      if (!observerRef.current && typeof IntersectionObserver !== "undefined" && trackRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              ratiosRef.current.set(entry.target, entry.intersectionRatio);
            }
            measure();
          },
          { root: trackRef.current, threshold: [0, HALF, 1] },
        );
      }
      observerRef.current?.observe(item);
      return () => {
        observerRef.current?.unobserve(item);
        ratiosRef.current.delete(item);
        itemsRef.current = itemsRef.current.filter((el) => el !== item);
        setCount(itemsRef.current.length);
      };
    },
    [measure],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const page = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track) return;
      const sign = isRtl(track) ? -1 : 1;
      const { atStart, atEnd } = positionRef.current;
      if (loop && direction === 1 && atEnd) {
        track.scrollTo({ left: 0 });
        return;
      }
      if (loop && direction === -1 && atStart) {
        track.scrollTo({ left: sign * track.scrollWidth });
        return;
      }
      track.scrollBy({ left: sign * direction * track.clientWidth });
    },
    [loop],
  );

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const item = itemsRef.current[index];
    if (!track || !item) return;
    // Only the track scrolls: scrollIntoView would move every ancestor
    // scroller too. The snap points settle it on the item's start.
    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const delta = isRtl(track) ? itemRect.right - trackRect.right : itemRect.left - trackRect.left;
    track.scrollTo({ left: track.scrollLeft + delta });
  }, []);

  const labels = useMemo(
    () => ({ region, previous, next, indicator, status: statusLabel }),
    [region, previous, next, indicator, statusLabel],
  );

  // Announce once the track has settled: a fling passes several items,
  // and only the one it stops on is news. The first measurement is the
  // resting position, not a change.
  const announcedRef = useRef<number | null>(null);
  useEffect(() => {
    if (!measured) return;
    const last = announcedRef.current;
    announcedRef.current = position.active;
    if (last === null || last === position.active) return;
    const timer = setTimeout(() => {
      setStatus(labels.status(position.active + 1, count));
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [measured, position.active, count, labels]);

  const ctx = useMemo<CarouselContextValue>(
    () => ({
      trackRef,
      register,
      count,
      active: position.active,
      atStart: position.atStart,
      atEnd: position.atEnd,
      loop,
      page,
      goTo,
      labels,
    }),
    [register, count, position, loop, page, goTo, labels],
  );

  const named = rest["aria-label"] != null || rest["aria-labelledby"] != null;

  return (
    <CarouselContext value={ctx}>
      <section
        aria-roledescription="carousel"
        aria-label={named ? undefined : labels.region}
        className={cx("loam-Carousel", className)}
        {...rest}
      >
        {children}
        <span role="status" className="loam-VisuallyHidden">
          {status}
        </span>
      </section>
    </CarouselContext>
  );
}
