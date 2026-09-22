"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Props for a box that scrolls its content inline (a wide table, a long
 * code line). While the content fits, the box is inert; once it overflows
 * it becomes a named region in the Tab order, so keyboard users can scroll
 * it. Detected with a ResizeObserver rather than declared, so a table that
 * fits on a wide screen adds no tab stop there.
 */
export function useScrollable<T extends HTMLElement>(
  label: string,
  role: "region" | "group" = "region",
) {
  const ref = useRef<T>(null);
  const [scrolls, setScrolls] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setScrolls(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return {
    ref,
    ...(scrolls ? { tabIndex: 0, role, "aria-label": label } : {}),
  };
}
