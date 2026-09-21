import type { RecipeMetaEntry } from "./types";

export function linkedRecipePrompt(entry: RecipeMetaEntry): string {
  return `Use the LoamUI skill to build the “${entry.meta.title}” recipe for my application.`;
}
