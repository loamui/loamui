import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Call to action with media",
  description:
    "A closing section with a photograph beside the words: two columns where there is room, one where there is not.",
  category: "page-sections",
  uses: ["SignpostLink"],
  notes: {
    modern:
      "A section named by its h2 holding a plain img with real alt text and its intrinsic size, so the layout has the picture’s shape before it loads. The section is the container and the inner element the grid; two columns arrive from the section’s own width, never from the viewport.",
    accessible:
      "The words come first in the markup on every width, so the reading order matches what a sighted reader gets even when the picture stacks beneath.",
  },
  composition:
    "One SignpostLink is the whole action row; the example's rule stops at its root and the picture is just an img in a grid cell.",
  tags: ["landing", "marketing", "closing", "cta", "image"],
  order: 4,
};
