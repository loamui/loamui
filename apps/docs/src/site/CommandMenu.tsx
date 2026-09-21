"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./Icons";
import { COMPONENTS, EXAMPLES_NAV, GETTING_STARTED, GUIDES, PRIMITIVES } from "./nav";
import { RECIPE_META } from "@/recipes/generated/meta";
import "./CommandMenu.css";

interface Result {
  label: string;
  hint: string;
  href: string;
}

/** One twin's worth of searchable text, as export-markdown writes it. */
interface Entry {
  url: string;
  title: string;
  description: string;
  text: string;
}

// The exported index is a static file, so it sits under the deployment's base
// path the same as every other asset.
const INDEX_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/search-index.json`;

/** Which part of the site a URL belongs to, for the row's hint. */
function sectionOf(url: string): string {
  if (url.startsWith("/docs/components/")) return "Component";
  if (url.startsWith("/recipes/")) return "Recipe";
  return "Guide";
}

/**
 * Rank a page for a query: every word must appear somewhere; a word in the
 * title outranks one in the description, which outranks one in the body.
 * Plain substring matching over the twins' prose — no engine, no index
 * build, and it finds a phrase that only appears in a page's body.
 */
function score(entry: Entry, words: string[]): number {
  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  const text = entry.text.toLowerCase();
  let total = 0;
  for (const word of words) {
    if (title.includes(word)) total += 8;
    else if (description.includes(word)) total += 3;
    else if (text.includes(word)) total += 1;
    else return 0;
  }
  return total;
}

const ALL: Result[] = [
  ...[...GETTING_STARTED.flatMap((g) => [g, ...(g.children ?? [])]), ...GUIDES].map((g) => ({
    label: g.name,
    hint: "Guide",
    href: g.href,
  })),
  ...PRIMITIVES.map((p) => ({
    label: p.name,
    hint: "Primitive",
    href: p.href,
  })),
  ...COMPONENTS.map((c) => ({
    label: c.name,
    hint: c.category,
    href: `/docs/components/${c.slug}`,
  })),
  ...EXAMPLES_NAV.map((e) => ({
    label: e.name,
    hint: "Recipes",
    href: e.href,
  })),
  ...RECIPE_META.map((e) => ({
    label: e.meta.title,
    hint: "Example",
    href: `/recipes/${e.category}/${e.slug}`,
  })),
];

/**
 * The site search: a native modal dialog (focus containment, Escape and
 * the backdrop come with `showModal()`) holding an APG editable combobox.
 * The text box owns focus; the list is a listbox the box points into with
 * `aria-activedescendant`, so arrow keys move a highlight that a screen
 * reader hears without focus leaving the box. Opens from the trigger or
 * with ⌘K / Ctrl+K.
 */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-option-${i}`;
  const router = useRouter();

  // The index is fetched once, the first time the palette opens, so the
  // page never pays for it and a visitor who never searches never loads it.
  const [index, setIndex] = useState<Entry[] | null>(null);
  useEffect(() => {
    if (!open || index) return;
    let live = true;
    fetch(INDEX_URL)
      .then((response) => (response.ok ? response.json() : []))
      .then((entries: Entry[]) => live && setIndex(entries))
      .catch(() => live && setIndex([]));
    return () => {
      live = false;
    };
  }, [open, index]);

  const results = useMemo<Result[]>(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    // With no query there is nothing to rank, so the curated list stands in
    // and the palette still works as a way to browse.
    if (!words.length) return ALL;
    // Until the index arrives (or if it never does), titles still match.
    if (!index) return ALL.filter((r) => words.every((w) => r.label.toLowerCase().includes(w)));
    return index
      .map((entry) => ({ entry, rank: score(entry, words) }))
      .filter(({ rank }) => rank > 0)
      .sort((a, b) => b.rank - a.rank || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 20)
      .map(({ entry }) => ({
        label: entry.title,
        hint: sectionOf(entry.url),
        href: entry.url,
      }));
  }, [q, index]);

  // Stable (only state setters inside), so the window keydown listener can
  // depend on it without re-subscribing per render.
  const openPalette = useCallback(() => {
    setQ("");
    setActive(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) setOpen(false);
        else openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPalette]);

  // Native <dialog>: showModal() brings focus containment, Escape and the
  // ::backdrop; the effect reconciles React state with the element.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      inputRef.current?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Backdrop-click fallback for browsers without `closedby`: clicks on the
  // backdrop hit the dialog element itself, never its children. Wired
  // imperatively, the same shape as Modal's own fallback.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === el) setOpen(false);
    };
    el.addEventListener("click", onBackdropClick);
    return () => el.removeEventListener("click", onBackdropClick);
  }, []);

  // The highlighted option stays in view as the arrow keys move it; the
  // list scrolls, the page does not.
  useEffect(() => {
    if (!open) return;
    const el = document.getElementById(`${baseId}-option-${active}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open, baseId]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Home" && results.length > 0) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && results.length > 0) {
      e.preventDefault();
      setActive(results.length - 1);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  return (
    <>
      <button
        type="button"
        className="site-CommandMenu-trigger"
        onClick={openPalette}
        aria-label="Search documentation"
        aria-keyshortcuts="Meta+K Control+K"
      >
        <SearchIcon width={16} height={16} />
        <span className="triggerLabel">Search…</span>
        <kbd className="kbd" aria-hidden>
          ⌘K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="site-CommandMenu-panel"
        aria-label="Search documentation"
        onClose={() => setOpen(false)}
        {...({ closedby: "any" } as object)}
      >
        <div className="searchRow">
          <SearchIcon width={18} height={18} />
          <input
            ref={inputRef}
            className="input"
            type="text"
            role="combobox"
            aria-label="Search components, guides and recipes"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? optionId(active) : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder="Search components, guides and recipes…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        {results.length === 0 && (
          <p className="empty" role="status">
            No results for “{q}”. Try a component name, a guide or an example.
          </p>
        )}
        {/* APG combobox: the options are never focused (the box keeps focus
            and points at one with aria-activedescendant), so they carry no
            tabindex and no key handler of their own. */}
        <ul
          id={listId}
          className="results"
          aria-label="Results"
          hidden={results.length === 0}
          {...{ role: "listbox" }}
        >
          {results.map((r, i) => {
            const option = {
              id: optionId(i),
              role: "option",
              "aria-selected": i === active,
              onMouseMove: () => setActive(i),
              // Keep focus in the box: a click on an option must not blur it.
              onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
              onClick: () => go(r.href),
            };
            return (
              <li key={r.href} className="result" {...option}>
                <span>{r.label}</span>
                <span className="hint">{r.hint}</span>
              </li>
            );
          })}
        </ul>
      </dialog>
    </>
  );
}
