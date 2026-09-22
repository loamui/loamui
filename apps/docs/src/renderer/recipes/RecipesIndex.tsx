"use client";

import { Suspense, useId, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Search, Select, VisuallyHidden } from "@loamui/core";
import { componentsUsed, recipeHref, recipesByCategory } from "@/recipes/catalog";
import { RECIPE_PREVIEWS } from "@/recipes/generated/previews";
import type { RecipeMetaEntry } from "@/recipes/types";
import "./RecipesIndex.css";
import { LazyThumb } from "./LazyThumb";
import { RecipeLoadBoundary } from "./RecipeLoadBoundary";

function matches(e: RecipeMetaEntry, term: string, uses: string): boolean {
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
export function RecipesIndex() {
  const [query, setQuery] = useState("");
  const [uses, setUses] = useState("");
  const usesId = useId();
  const term = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      recipesByCategory()
        .map((g) => ({
          ...g,
          items: g.items.filter((e) => matches(e, term, uses)),
        }))
        .filter((g) => g.items.length > 0),
    [term, uses],
  );
  const shown = groups.reduce((n, g) => n + g.items.length, 0);
  const total = recipesByCategory().reduce((n, g) => n + g.items.length, 0);
  const filtered = shown !== total;

  const clear = () => {
    setQuery("");
    setUses("");
  };

  return (
    <div className="site-RecipesIndex">
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
          <label htmlFor={usesId}>Uses</label>
          <Select.Root
            id={usesId}
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
        <p role="status">{filtered ? `${shown} matching` : ""}</p>
      </div>

      {groups.length === 0 && (
        <div className="empty">
          <p>No recipe matches.</p>
          <p>
            Try a shorter word, or build it from the <Link href="/docs/components">primitives</Link>{" "}
            yourself.
          </p>
          <Button onClick={clear}>Clear the search</Button>
        </div>
      )}

      {groups.map(({ category, items }) => (
        <section
          key={category.slug}
          id={category.slug}
          className="group"
          aria-labelledby={`${category.slug}-heading`}
        >
          <header>
            <h2 id={`${category.slug}-heading`}>{category.title}</h2>
            <Link href={`/recipes/${category.slug}`} prefetch={false}>
              View all
              <VisuallyHidden> in {category.title}</VisuallyHidden>
              <span aria-hidden> →</span>
            </Link>
          </header>
          <ul>
            {items.map((e) => {
              const Preview = RECIPE_PREVIEWS[e.slug]!;
              return (
                <li key={e.slug} className="card">
                  {/* The preview is a live render and may contain links and
                    buttons, so it sits beside the card's link (inert), not
                    inside it; the link's ::after covers the whole card. */}
                  <LazyThumb className="thumb">
                    <div className="thumbInner">
                      <RecipeLoadBoundary fallback={<p>Preview unavailable</p>}>
                        <Suspense fallback={null}>
                          <Preview />
                        </Suspense>
                      </RecipeLoadBoundary>
                    </div>
                  </LazyThumb>
                  <div className="cardBody">
                    <Link href={recipeHref(e)} className="cardLink" prefetch={false}>
                      {e.meta.title}
                    </Link>
                    {e.meta.uses.length > 0 && (
                      <ul aria-label="Uses">
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
