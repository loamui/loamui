import { RECIPES } from "./generated/index";
import type { RecipeEntry } from "./types";

export { RECIPES } from "./generated/index";
export { RECIPE_CATEGORIES, getCategory } from "./categories";
export { recipeHref, recipesByCategory, componentsUsed } from "./catalog";
export { PILLARS } from "./types";
export type {
  RecipeCategory,
  RecipeEntry,
  RecipeMeta,
  RecipeMetaEntry,
  RecipeSource,
  PillarKey,
} from "./types";

export function recipesIn(category: string): RecipeEntry[] {
  return RECIPES.filter((e) => e.category === category);
}

export function getRecipe(category: string, slug: string): RecipeEntry | undefined {
  return RECIPES.find((e) => e.category === category && e.slug === slug);
}
