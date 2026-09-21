import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Table of reviews",
  description:
    "The most-grown varieties as a Table: a Rating and the review count per row, and a Meter of how many would grow it again, with both shares written either side of it.",
  category: "data-display",
  uses: ["Meter", "Rating", "Table"],
  notes: {
    modern:
      "A real table with a caption, column headers and a row header per variety; each rating is a Rating in display mode, one named picture of the value rather than five decorative stars, and each share is a native meter. The split cell is a three-column grid with both figures at fixed widths in tabular numerals and the Meter filling the middle track, so the bars line up down the column without a rule on the Meter.",
    accessible:
      "The Meter is named Would grow again and carries the value, and the two shares are text that finishes in hidden words, so a reader hears 91% would, 9% would not; forced colours are the Meter's own concern.",
  },
  composition:
    "Table rules the rows and the header, Rating draws the stars and Meter draws the share; the example adds only the split cell's grid, and reaches into none of them.",
  tags: ["reviews", "ratings", "table", "distribution", "meter", "would grow again"],
  order: 15,
};
