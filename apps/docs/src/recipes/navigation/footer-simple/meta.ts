import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Simple footer",
  description: "A one-row site footer: the brand, a short row of links and the copyright line.",
  category: "navigation",
  uses: [],
  notes: {
    modern:
      "A footer landmark, so a screen reader can jump to the end of the page; the nav inside is named Footer to tell it from the header’s Primary nav, and the copyright is a small element. A single wrapping flex row, answered by the footer’s own width: the links sit between the brand and the small print, and wrap beneath them where the row is too short.",
    accessible:
      "Four targets on one line are told apart by the gap between them and underline on hover; the markers are stripped inside a nav, where every browser keeps the list's semantics.",
  },
  composition:
    "Nothing is imported: a brand link, four links in a list and the small print on one flex row is the whole footer, dressed by the element styles.",
  tags: ["site footer", "copyright", "small print"],
  order: 3,
};
