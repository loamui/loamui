import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Sortable table",
  description:
    "The seed stock as a Table whose Variety, In stock and Price columns sort on a press, the rows sorted in the page's own state.",
  category: "data-display",
  uses: ["Badge", "Price", "Table"],
  notes: {
    modern:
      "A real table with a caption, column headers and a row header per variety, so a cell is announced with the row and column it belongs to; the sort control is a button, not a header that happens to be clickable. The figures are set end-aligned in tabular numerals so a column stacks on its last digit, and the sort glyph is the Table’s own, drawn from the aria-sort the header already carries. A short stock line wraps its Badge in a warning region, so Low takes the status colour from where it sits rather than from a prop.",
    accessible:
      "Each sortable header carries aria-sort, and its button ends in hidden words that say what a press will do; the caption names the scroll region the Table becomes when it overflows.",
  },
  composition:
    "Table.Th carries the sort and Table.SortButton asks for the next one; the example sorts the rows in state and hands the result back, so the parts announce and style and the page decides the order.",
  tags: ["table", "sort", "data", "stock", "inventory"],
  order: 9,
};
