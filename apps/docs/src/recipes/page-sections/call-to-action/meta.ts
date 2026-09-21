import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Call to action",
  description:
    "A closing section on a subtle surface: a title, one sentence and two actions, centred.",
  category: "page-sections",
  uses: ["SignpostLink"],
  notes: {
    modern:
      "A section named by its h2, so the close of the page is a landmark a screen reader can jump to, not a styled div. The surface is the subtle background token with the large radius, and the words are centred by the grid, so nothing here is a colour or a size of the section’s own.",
    accessible:
      "Both actions go somewhere, so both are links; the block keeps a border in forced colours, where its tint would otherwise vanish.",
  },
  composition:
    "One SignpostLink for the primary path and a plain link beside it; the section only spaces them, and its rule stops at the SignpostLink's root.",
  tags: ["landing", "marketing", "closing", "cta"],
  order: 3,
};
