import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Features with title",
  description:
    "A two-column section: a heading, a paragraph and a link on one side, and four features with icons on the other.",
  category: "page-sections",
  uses: ["SignpostLink"],
  notes: {
    modern:
      "A section named by its h2, with the four points as a list of h3 headings, so the outline holds the argument and its evidence in order. Two grids each answer the section’s own width: the inner element splits 2:3 at 48rem, and the list of points fits two across whenever its column has 28rem to give them.",
    accessible:
      "The icons are aria-hidden because the headings carry the meaning, the list keeps role=list so its count survives list-style: none, and the tint behind each glyph gets a border in forced colours.",
  },
  composition:
    "One SignpostLink to the fuller account; the points are the example's own markup, an icon, a heading and a line, with no component between.",
  tags: ["features", "benefits", "split", "icons", "about"],
  order: 25,
};
