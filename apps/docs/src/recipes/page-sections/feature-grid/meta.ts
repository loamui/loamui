import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Feature grid",
  description:
    "Six features under a section header: an icon, a heading and a line each, in a grid that fits as many across as it has room for.",
  category: "page-sections",
  uses: [],
  notes: {
    modern:
      "A section named by its h2, a header for the intro and a list of six items with h3 headings, so the outline reads the way the page looks. The list is an auto-fit grid answering the section’s own width, and the icon square is sized in em on the heading’s type so it rides the fluid scale.",
    accessible:
      "The icons are aria-hidden because the headings carry the meaning, and the list keeps role=list so the count survives list-style: none in every browser.",
  },
  composition:
    "No card and no component: a feature is scanned, not compared, so each is an icon, a heading and a muted line set apart by space.",
  tags: ["features", "benefits", "grid", "icons", "marketing"],
  order: 8,
};
