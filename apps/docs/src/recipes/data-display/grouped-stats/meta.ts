import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Grouped stats",
  description:
    "Three figures from one event on one Card, each with a sentence saying what it counts and a line comparing it with last year, divided by lines rather than split into tiles.",
  category: "data-display",
  uses: ["Card", "Price"],
  notes: {
    modern:
      "The Card is a section named by its heading, and the three figures are one description list: each term has its figure, its sentence and its comparison as descriptions. The Card is a container: stacked with a line above each figure where it is narrow, a row divided by lines where it is wide, with the end insets dropped so the row sits flush.",
    accessible:
      "Each comparison is a sentence, Up 22% on last year's open day, rather than an arrow and a number, so the direction is said and nothing depends on colour.",
  },
  composition:
    "Card is rendered as the section and Price writes the amount; the example only arranges the list inside and never touches the Card's own border, radius or padding.",
  tags: ["metrics", "kpi", "summary", "comparison", "event", "dashboard"],
  order: 13,
};
