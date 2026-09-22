"use client";

import { useSyncExternalStore } from "react";

// Support never changes within a page, so nothing ever notifies.
const subscribe = () => () => {};
const serverFalse = () => false;
const clientTrue = () => true;

/**
 * A feature probe read as an external store: `false` on the server and
 * during hydration, so the markup matches, and the probe's answer from the
 * first client render otherwise. No effect, no state, no extra render on a
 * client mount. Probe the element prototypes, never `window` or `document`.
 */
export function useSupports(probe: () => boolean): boolean {
  return useSyncExternalStore(subscribe, probe, serverFalse);
}

/**
 * `false` on the server and while hydrating, `true` afterwards: the knowledge
 * a Root needs to drop a reference it emitted optimistically in the server
 * HTML once nothing has claimed it.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, clientTrue, serverFalse);
}
