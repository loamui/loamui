"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mount a live example when its card approaches the viewport, then retain it
 * for return visits. The fixed-aspect placeholder keeps the card's size
 * stable before mounting. Card layout stays available to the observer;
 * the surrounding grids provide explicit columns to bound intrinsic sizing.
 */
export function LazyThumb({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    // Preload nearby previews and keep them mounted when scrolling back.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden inert>
      {near ? children : null}
    </div>
  );
}
