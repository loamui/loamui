import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Stat with trend",
  description:
    "One headline figure over its label, with the change since last week as a Badge and an eight-week sparkline beside it.",
  category: "data-display",
  uses: ["Badge", "Card"],
  notes: {
    modern:
      "A description list of one term and three descriptions: the label, the figure, and the trend, so the markup reads label then value while the screen leads with the figure. The figure is set in tabular lining numerals from the display face, and the trend row wraps on its own when the tile is narrow, with no breakpoint naming a device. That row declares --loam-context: success, so the Badge takes the status colour from it, and so does the sparkline, whose stroke is the primary token the region re-answers.",
    accessible:
      "The sparkline is an image named by its own title, which reads the eight values and says they are rising; the arrow in the Badge is hidden because the words already say up.",
  },
  composition:
    "Card is the surface, rendered as a dl; the sparkline is an inline SVG polyline in the markup, not a chart library, so a reader changes the points as they would change the words.",
  tags: ["metrics", "dashboard", "kpi", "sparkline", "trend"],
  order: 2,
};
