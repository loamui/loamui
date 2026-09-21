"use client";

import { Suspense, useId, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Search, Select, VisuallyHidden } from "@loamui/core";
import { componentsUsed, exampleHref, examplesByCategory } from "@/examples/catalog";
import { EXAMPLE_PREVIEWS } from "@/examples/generated-previews";
import type { ExampleMetaEntry } from "@/examples/types";
import "./examples-index.css";
import { LazyThumb } from "./examples-thumb";
import { ExampleLoadBoundary } from "./examples-load-boundary";

function matches(e: ExampleMetaEntry, term: string, uses: string): boolean {
  if (uses && !e.meta.uses.includes(uses)) return false;
  if (!term) return true;
  const hay = [e.meta.title, e.meta.description, e.slug, ...(e.meta.tags ?? []), ...e.meta.uses]
    .join(" ")
    .toLowerCase();
  return term.split(/\s+/).every((word) => hay.includes(word));
}

/**
 * The index: a search and a component filter on one row, then every
 * example as a card with a live preview scaled down inside it. The
 * preview is the real example at two fifths of its size, inert and hidden
 * from assistive technology, so the card can never show something the
 * code does not.
 * Browsing links disable prefetch so offscreen recipes stay unloaded.
 */
export function ExamplesIndex() {
  const [query, setQuery] = useState("");
  const [uses, setUses] = useState("");
  const usesId = useId();
  const term = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      examplesByCategory()
        .map((g) => ({
          ...g,
          items: g.items.filter((e) => matches(e, term, uses)),
        }))
        .filter((g) => g.items.length > 0),
    [term, uses],
  );
  const shown = groups.reduce((n, g) => n + g.items.length, 0);
  const total = examplesByCategory().reduce((n, g) => n + g.items.length, 0);
  const filtered = shown !== total;

  const clear = () => {
    setQuery("");
    setUses("");
  };

  return (
    <div className="site-ExamplesIndex">
      <div className="filters">
        <Search.Root
          aria-label="Search recipes"
          className="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <VisuallyHidden render={<Search.Label />}> Search recipes</VisuallyHidden>
          <Search.Input
            placeholder="Search recipes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Search.Root>
        <div className="usesGroup">
          <label className="usesLabel" htmlFor={usesId}>
            Uses
          </label>
          <Select.Root
            id={usesId}
            className="uses"
            wrapperProps={{ className: "usesField" }}
            value={uses}
            onChange={(e) => setUses(e.target.value)}
          >
            <Select.Option value="">Any component</Select.Option>
            {componentsUsed().map((c) => (
              <Select.Option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </Select.Option>
            ))}
          </Select.Root>
        </div>
        <p className="status" role="status">
          {filtered ? `${shown} matching` : ""}
        </p>
      </div>

      {groups.length === 0 && (
        <div className="empty">
          <p className="emptyTitle">No recipe matches.</p>
          <p className="emptyText">
            Try a shorter word, or build it from the <Link href="/docs/components">primitives</Link>{" "}
            yourself.
          </p>
          <Button className="emptyClear" onClick={clear}>
            Clear the search
          </Button>
        </div>
      )}

      {groups.map(({ category, items }) => (
        <section
          key={category.slug}
          id={category.slug}
          className="group"
          aria-labelledby={`${category.slug}-heading`}
        >
          <div className="groupHead">
            <h2 id={`${category.slug}-heading`} className="groupTitle">
              {category.title}
            </h2>
            <Link href={`/recipes/${category.slug}`} className="groupLink" prefetch={false}>
              View all
              <VisuallyHidden> in {category.title}</VisuallyHidden>
              <span aria-hidden> →</span>
            </Link>
          </div>
          <ul className="grid">
            {items.map((e) => {
              const Preview = EXAMPLE_PREVIEWS[e.slug]!;
              return (
                <li key={e.slug} className="card">
                  {/* The preview is a live render and may contain links and
                    buttons, so it sits beside the card's link (inert), not
                    inside it; the link's ::after covers the whole card. */}
                  <LazyThumb className="thumb">
                    <div className="thumbInner">
                      <ExampleLoadBoundary fallback={<p>Preview unavailable</p>}>
                        <Suspense fallback={null}>
                          <Preview />
                        </Suspense>
                      </ExampleLoadBoundary>
                    </div>
                  </LazyThumb>
                  <div className="cardBody">
                    <Link href={exampleHref(e)} className="cardLink" prefetch={false}>
                      {e.meta.title}
                    </Link>
                    {e.meta.uses.length > 0 && (
                      <ul className="cardUses" aria-label="Uses">
                        {e.meta.uses.map((name) => (
                          <li key={name}>
                            <Badge.Root size="sm">
                              <Badge.Text>{name}</Badge.Text>
                            </Badge.Root>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
