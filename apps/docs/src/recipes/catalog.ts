import { RECIPE_META } from "./generated/meta";
import { RECIPE_CATEGORIES } from "./categories";
import type { RecipeMetaEntry } from "./types";

export { RECIPE_META } from "./generated/meta";

/** Browsing needs metadata only; keep component imports out of this module. */
export function recipesByCategory() {
  return RECIPE_CATEGORIES.map((category) => ({
    category,
    items: RECIPE_META.filter((e) => e.category === category.slug),
  })).filter((g) => g.items.length > 0);
}

/** Every core component any example uses, most used first. */
export function componentsUsed(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of RECIPE_META)
    for (const name of e.meta.uses) counts.set(name, (counts.get(name) ?? 0) + 1);
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function recipeHref(e: Pick<RecipeMetaEntry, "category" | "slug">): string {
  return `/recipes/${e.category}/${e.slug}`;
}
