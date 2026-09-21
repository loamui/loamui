"use client";

import type { ReactNode } from "react";
import { useScrollable } from "./scrollable";

/** A box whose content scrolls inline; focusable and named only once it does. */
export function ScrollRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const scroll = useScrollable<HTMLDivElement>(label);
  return (
    <div className={className} {...scroll}>
      {children}
    </div>
  );
}
