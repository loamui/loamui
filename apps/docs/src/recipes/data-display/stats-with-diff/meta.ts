import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Stats with change",
  description:
    "Four figures in a row of Card tiles, each with its change on last month: an up or down glyph, the percentage in the direction's colour, and the direction as a word.",
  category: "data-display",
  uses: ["Card", "Price"],
  notes: {
    modern:
      "Each tile is a description list: the label is the term, the figure and its change are descriptions; the sales figure is a data element whose value is the number. The row is an auto-fit grid answering its own width, and the figures and the percentages are set in tabular lining numerals so the tiles line up. The direction’s colour is the success or danger text token on the glyph and the figure, so it holds contrast in both schemes; a region could re-answer it, but the direction is data, not the region’s status.",
    accessible:
      "The arrow is hidden and the direction is written as a word, so a reader hears Up 9% on August and forced colours lose nothing: the arrow is a stroke in currentColor and the word is text.",
  },
  composition:
    "Card is the surface, rendered as a dl, and Price writes the amount; the example only arranges the pairs inside and never touches the Card's own border, radius or padding.",
  tags: ["metrics", "kpi", "change", "trend", "dashboard", "comparison"],
  order: 12,
};
