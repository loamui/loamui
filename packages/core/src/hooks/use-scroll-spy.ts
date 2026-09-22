"use client";

import { useEffect, useState } from "react";

export interface UseScrollSpyOptions {
  /**
   * The observer's `rootMargin`: shrink the band a heading must enter to
   * count as in view, e.g. `"0px 0px -70% 0px"` for the top third of the
   * viewport. @default the whole viewport
   */
  rootMargin?: string;
  /** The observer's `threshold`. @default 0 */
  threshold?: number | number[];
}

/**
 * Which of the elements with these ids is in view: the first, in the order
 * given, that intersects the viewport, or the last one that did once none
 * does (the reader is inside its section). `null` before anything has
 * intersected, and on the server.
 *
 * ```tsx
 * const active = useScrollSpy(["intro", "usage", "api"]);
 * <Nav.Link href="#usage" current={active === "usage" && "location"}>Usage</Nav.Link>
 * ```
 *
 * One IntersectionObserver for the set, disconnected on unmount or when the
 * ids change; a fresh array with the same ids does not re-observe.
 */
export function useScrollSpy(ids: readonly string[], options?: UseScrollSpyOptions): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("\n");
  const rootMargin = options?.rootMargin;
  // A fresh options object each render must not re-observe: the threshold
  // is compared by value.
  const thresholdKey = Array.isArray(options?.threshold)
    ? options.threshold.join(",")
    : (options?.threshold ?? 0);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const order = key ? key.split("\n") : [];
    const threshold =
      typeof thresholdKey === "number" ? thresholdKey : thresholdKey.split(",").map(Number);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = order.find((id) => visible.has(id));
        if (first !== undefined) setActive(first);
      },
      { rootMargin, threshold },
    );
    for (const id of order) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [key, rootMargin, thresholdKey]);

  return active;
}
