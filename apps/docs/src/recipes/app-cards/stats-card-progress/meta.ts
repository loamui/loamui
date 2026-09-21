import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Stats card with progress",
  description:
    "One figure in a Card: the count of orders packed this week over the total, a thick Progress that says how far along it is, and what is left in words.",
  category: "app-cards",
  uses: ["Card", "Progress"],
  notes: {
    modern:
      "The bar is the native progress element with its label as its accessible name, and the count is text a reader can select and copy, not a number drawn into a canvas. The count is set in tabular lining numerals from the display face so it holds its width as it changes, and the thick track is the Progress’s own large size, the one size a track can carry.",
    accessible:
      "The bar speaks 70% packed through labels.value, and the count, the total and what is left are all written out, so the fill is never the only thing saying how far along the week is.",
  },
  composition:
    "Card and Progress are dropped in as they come; the example writes the figures around the bar and never reaches into it.",
  tags: ["progress", "kpi", "figure", "dashboard", "goal"],
  order: 5,
};
