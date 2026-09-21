import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Hero with bullets",
  description:
    "A page-opening section that makes its case in three ticked points before one action, beside a photograph.",
  category: "page-sections",
  uses: ["Button"],
  notes: {
    modern:
      "A section named by its h1 and a real list for the three points, each a strong title over a line, so a screen reader announces three items where the eye sees three ticks. The section is a container and the inner element the grid: one column below 48rem of its own width, then a 3:2 split with the picture in the smaller column, and the tick is sized in em so it rides the fluid scale.",
    accessible:
      "The ticks are aria-hidden glyphs with the meaning in the words, the list keeps role=list so its count survives list-style: none, and the tick's tint gets a border in forced colours.",
  },
  composition:
    "One Button, because there is one thing to do; the section's rule stops at its root and the tick is the example's own markup, not a component.",
  tags: ["landing", "marketing", "benefits", "checklist"],
  order: 23,
};
