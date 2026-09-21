"use client";

import { useSyncExternalStore } from "react";

// One store for every subscriber: a single observer + media query fan out.
// The snapshot reads the data-theme attribute (the site's only scheme
// override) rather than getComputedStyle, which would force a style flush.
const listeners = new Set<() => void>();
let teardown: (() => void) | undefined;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!teardown) {
    const notify = () => {
      for (const l of listeners) l();
    };
    const obs = new MutationObserver(notify);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", notify);
    teardown = () => {
      obs.disconnect();
      mq.removeEventListener("change", notify);
      teardown = undefined;
    };
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) teardown?.();
  };
}

function snapshot(): "light" | "dark" {
  const pinned = document.documentElement.dataset.theme;
  if (pinned === "dark" || pinned === "light") return pinned;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** The scheme the page shows right now: the pinned one, else the system's. */
export function useSiteScheme(): "light" | "dark" {
  return useSyncExternalStore(subscribe, snapshot, () => "light");
}
