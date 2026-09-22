"use client";

import { useId, useMemo } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { SearchContext, SearchContextValue } from "../root/SearchRootContext.js";

/**
 * The site's or page's search, composed from parts.
 *
 * The Root renders a native `<search>` element — the search landmark
 * itself — around a native `<form>`, so submitting is the browser's: Enter in the box, the button, a GET to `action` with the
 * query under `name`. The Input is the library's Input with
 * `type="search"`, which keeps the platform's own clear affordance; the
 * Button is the library's Button as a submit.
 *
 * Every search needs a name. Search.Label gives the box one that is read
 * but not seen (style it to show it); a Field around the Input names it
 * visibly instead, and the Input wires itself to that Field. The landmark
 * is named "Search" by default — give a second search on the page its own
 * `aria-label` ("Site search", "Search this table") so the two are told
 * apart in a landmark list.
 *
 * ```tsx
 * <Search.Root action="/search">
 *   <Search.Label>Search this site</Search.Label>
 *   <Search.Input />
 *   <Search.Button />
 * </Search.Root>
 * ```
 */
export interface SearchRootProps extends PartProps<"form"> {
  /**
   * The landmark's accessible name. Two searches on one page must differ
   * ("Site search", "Search this table"). @default "Search"
   */
  "aria-label"?: string;
}

export function SearchRoot({
  "aria-label": ariaLabel = "Search",
  className,
  style,
  method = "get",
  children,
  ref,
  ...rest
}: SearchRootProps) {
  const inputId = useId();
  const value = useMemo<SearchContextValue>(() => ({ inputId }), [inputId]);
  return (
    <SearchContext value={value}>
      {/* className and style dress the landmark; the form gets the rest,
          so action, method, onSubmit and the ref reach the element that
          submits. No role: <search> is the search landmark by itself. */}
      <search className={cx("loam-Search", className)} style={style} aria-label={ariaLabel}>
        <form ref={ref} method={method} {...rest}>
          {children}
        </form>
      </search>
    </SearchContext>
  );
}
