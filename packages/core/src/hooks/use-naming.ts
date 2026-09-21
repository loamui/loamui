"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { usePresence } from "./use-presence.js";
import { useHydrated } from "./use-support.js";

/**
 * Server-safe naming for a composition whose Root is named by one of its
 * parts (a Title names a section, an Author names a comment).
 *
 * The Root mints the id and points `aria-labelledby` at it in the first
 * render, so the server HTML already carries the name. The part renders
 * that id and registers on mount; once hydrated, only a registered part
 * keeps the reference (a dangling `aria-labelledby` is an axe failure), and
 * the fallback label, when given, takes over. A consumer's own `aria-label`
 * or `aria-labelledby` always wins.
 */
export function useNamedRoot(
  props: { "aria-label"?: string; "aria-labelledby"?: string },
  fallbackLabel?: string,
) {
  const autoId = useId();
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const hydrated = useHydrated();

  const register = useCallback((id: string) => {
    setRegisteredId(id);
    return () => setRegisteredId((current) => (current === id ? null : current));
  }, []);

  // Optimistic until hydrated: the server HTML names the Root by the id its
  // part will render. Afterwards the reference follows what registered.
  const nameId = registeredId ?? (hydrated ? null : autoId);

  const consumerNamed = props["aria-label"] != null || props["aria-labelledby"] != null;
  const labelling: { "aria-label"?: string; "aria-labelledby"?: string } = consumerNamed
    ? {}
    : nameId
      ? { "aria-labelledby": nameId }
      : fallbackLabel
        ? { "aria-label": fallbackLabel }
        : {};

  return { nameId: autoId, register, labelling };
}

/**
 * The part side of {@link useNamedRoot}: the id the part must render, and
 * the registration that keeps the Root's reference honest. Pass the
 * consumer's own `id` when they gave one.
 */
export function useNamePart(
  context: { nameId: string; register: (id: string) => () => void } | null,
  ownId?: string,
) {
  const id = ownId ?? context?.nameId;
  const register = context?.register;
  useEffect(() => {
    if (!register || !id) return;
    return register(id);
  }, [register, id]);
  return id;
}

/**
 * Server-safe `aria-describedby` for a part that may or may not be present:
 * the owner mints the id and references it in the first render; the part
 * renders the id and registers; once hydrated, the reference stands only
 * while a part is registered.
 */
export function useOptionalSlot() {
  const id = useId();
  const [registered, register] = usePresence();
  const hydrated = useHydrated();
  const present = registered || !hydrated;
  return { id, present, register, ref: present ? id : undefined };
}
