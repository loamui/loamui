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

interface Entry {
  url: string;
  title: string;
  description: string;
  text: string;
}

const INDEX_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/search-index.json`;

function sectionOf(url: string): string {
  if (url.startsWith("/docs/components/")) return "Component";
  if (url.startsWith("/recipes/")) return "Recipe";
  return "Guide";
}

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

  const [index, setIndex] = useState<Entry[] | null>(null);
  useEffect(() => {
    if (!open || index) return;
    let live = true;
    fetch(INDEX_URL)
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .then((entries: Entry[] | null) => {
        // Failed requests keep title search available and retry on the next open.
        if (live && entries) setIndex(entries);
      });
    return () => {
      live = false;
    };
  }, [open, index]);

  const results = useMemo<Result[]>(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return ALL;
    if (!index?.length)
      return ALL.filter((r) => words.every((w) => r.label.toLowerCase().includes(w)));
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

  // Browsers without closedby still need backdrop dismissal.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === el) setOpen(false);
    };
    el.addEventListener("click", onBackdropClick);
    return () => el.removeEventListener("click", onBackdropClick);
  }, []);

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
        <span>Search…</span>
        <kbd aria-hidden>⌘K</kbd>
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
          <p role="status">No results for “{q}”. Try a component name, a guide or an example.</p>
        )}
        <ul id={listId} aria-label="Results" hidden={results.length === 0} {...{ role: "listbox" }}>
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
              <li key={r.href} {...option}>
                <span>{r.label}</span>
                <span>{r.hint}</span>
              </li>
            );
          })}
        </ul>
      </dialog>
    </>
  );
}
