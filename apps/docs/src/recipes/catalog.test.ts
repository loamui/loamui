import { describe, expect, it } from "vitest";
import { RECIPE_META, recipesByCategory } from "./catalog";
import { RECIPE_PREVIEWS } from "./generated/previews";
import { RECIPE_SOURCE } from "./generated/source";
import { PUBLISHED_RECIPES } from "./recipes";

describe("published recipes", () => {
  it("publishes only the selected identities, previews and copyable sources", () => {
    expect(RECIPE_META.map((entry) => `${entry.category}/${entry.slug}`).sort()).toEqual(
      [...PUBLISHED_RECIPES].sort(),
    );
    const slugs = RECIPE_META.map((entry) => entry.slug).sort();
    expect(Object.keys(RECIPE_PREVIEWS).sort()).toEqual(slugs);
    expect(Object.keys(RECIPE_SOURCE).sort()).toEqual(slugs);
    expect(recipesByCategory().every((group) => group.items.length > 0)).toBe(true);
  });
  it("keeps the curated categories and selection guidance available", () => {
    expect(recipesByCategory().map(({ category }) => category.title)).toEqual([
      "Heroes",
      "Banners",
      "Cards",
      "Media",
      "Grids",
      "Content",
      "Forms",
    ]);
    expect(RECIPE_META).toHaveLength(15);
    for (const entry of RECIPE_META) expect(entry.meta.whenToUse?.trim()).toBeTruthy();
  });
});
