import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Card with stats",
  description:
    "A campaign in a Card: a photo, a title and description, a Progress toward the target with the count and the target beneath it, and three figures in columns at the foot.",
  category: "app-cards",
  uses: ["Card", "Progress"],
  notes: {
    modern:
      "The bar is the native progress element named by its label, and the three figures are one description list whose terms follow their values on screen while the markup reads term first. The figures are tabular lining numerals so the count and the target line up under the bar, and the three columns are a grid divided by lines, with the first column’s inset dropped so the row starts flush.",
    accessible:
      "The bar speaks its value as 64% of the target through labels.value, and the count so far and the target are written out rather than left to the fill; the photo is decorative, so its alt is empty.",
  },
  composition:
    "Card and Progress are dropped in as they come; the example writes the figures and the list around them and never reaches into the bar.",
  tags: ["campaign", "goal", "progress", "figures", "dashboard"],
  order: 3,
};
