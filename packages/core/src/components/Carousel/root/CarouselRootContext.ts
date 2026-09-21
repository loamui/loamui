"use client";

import { createContext } from "react";
import type { RefObject } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";

export interface CarouselLabels {
  /** The region's name, unless you pass `aria-label` or `aria-labelledby`. @default "Carousel" */
  region?: string;
  /** The Previous button's name. @default "Previous" */
  previous?: string;
  /** The Next button's name. @default "Next" */
  next?: string;
  /** An indicator's name, from its 1-based position and the count. @default "Go to slide i of n" */
  indicator?: (index: number, count: number) => string;
  /** The status read once the track settles on an item. @default "Slide i of n" */
  status?: (index: number, count: number) => string;
}

export interface CarouselContextValue {
  trackRef: RefObject<HTMLUListElement | null>;
  /** An Item announces its element; the Root observes it and counts it. */
  register: (item: HTMLElement) => () => void;
  count: number;
  /** The first item at least half in view, 0-based. */
  active: number;
  atStart: boolean;
  atEnd: boolean;
  loop: boolean;
  /** Scroll by one width of the track, in reading order. */
  page: (direction: -1 | 1) => void;
  /** Scroll so an item sits at the start of the track. */
  goTo: (index: number) => void;
  labels: Required<CarouselLabels>;
}

export const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarouselContext(part: string): CarouselContextValue {
  return useRequiredContext(CarouselContext, part, "Carousel.Root");
}

export function defaultIndicator(index: number, count: number): string {
  return `Go to slide ${index} of ${count}`;
}

export function defaultStatus(index: number, count: number): string {
  return `Slide ${index} of ${count}`;
}

export const NO_LABELS: CarouselLabels = {};

/** An item counts as in view from this share of it; as wholly in view from FULL. */
export const HALF = 0.5;
export const FULL = 0.99;

/** How long the track must be still before its position is announced. */
export const SETTLE_MS = 150;

export function inDocumentOrder<T extends Element>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
}

export function isRtl(el: Element): boolean {
  return getComputedStyle(el).direction === "rtl";
}

export interface Position {
  active: number;
  atStart: boolean;
  atEnd: boolean;
}

export const AT_REST: Position = { active: 0, atStart: true, atEnd: false };
