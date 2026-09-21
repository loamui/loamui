import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Stats grid",
  description:
    "Three headline figures in a row of Card tiles, a large value over its label and nothing else: the top line of a dashboard.",
  category: "data-display",
  uses: ["Card"],
  notes: {
    modern:
      "Each tile is a description list of one pair: the label is the term and the figure its description, so the markup reads label then value while the screen shows value over label. The row is an auto-fit grid answering its own width, and the figures are set in tabular lining numerals from the display face so a row of them shares a baseline and a width per digit. The tiles declare no region: a figure is a fact, not a status, so nothing here is green or red, and a tile dropped into a success region would stay plain because no Badge or Button inside it answers one.",
    accessible:
      "The group is named for what the figures summarise, so a reader arriving by landmark hears This season at a glance before the first label, and every figure is text that selects, copies and scales.",
  },
  composition:
    "Card is the surface, rendered as a dl; the example only arranges the pair inside it and never touches the Card's own border, radius or padding.",
  tags: ["metrics", "dashboard", "kpi", "figures"],
  order: 1,
};
