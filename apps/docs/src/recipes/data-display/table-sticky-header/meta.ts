import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Table with a sticky header",
  description:
    "Twelve lines of seed stock in a Table capped in height, the column headers staying in view as the rows pass under them.",
  category: "data-display",
  uses: ["Table"],
  notes: {
    modern:
      "A real table with a caption and row headers; the header sticks with position: sticky on the header cells themselves, which is what the platform provides and what Table’s stickyHeader asks of it, so nothing is cloned or measured. The cap is Table’s public --loam-table-block-size, one custom property declared on the Table from the example’s scope; the header’s surface and its edge are Table’s own, so the example paints nothing.",
    accessible:
      "A scroller that only a pointer can move is out of reach of a keyboard, so once the rows overflow the cap the Table makes itself a region named by its caption with a tab stop, and the focus ring marks it; the header cells stay readable as they stick because Table paints them an opaque surface.",
  },
  composition:
    "Table with stickyHeader, as core ships it: the Table's own element is the scroller, so the cap goes on it through the public property rather than on a wrapper of the example's, and no rule reaches a header cell; the edge round it is the example's div.",
  tags: ["table", "sticky", "scroll", "stock", "inventory", "long list"],
  order: 16,
};
