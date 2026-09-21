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

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ALL;
    return ALL.filter((r) => r.label.toLowerCase().includes(term));
  }, [q]);

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
