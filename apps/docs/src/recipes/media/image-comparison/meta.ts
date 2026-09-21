import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Image comparison",
  description:
    "Black-and-white and colour treatments of the same photograph in one frame, the second revealed by a Range the reader drags or moves with the arrow keys.",
  whenToUse:
    "Use to compare two views of the same subject with a labelled, keyboard-operable reveal control. Choose a gallery when the images are separate subjects.",
  category: "media",
  uses: ["Range"],
  integration:
    "Use photographs of the same subject with matching dimensions and framing, and update both descriptions and the caption. This sample compares grayscale and colour treatments of one photo. React hydration is required to update the reveal; the initial images and caption remain available before it.",
  notes: {
    modern:
      "The handle is a real range input, so the comparison can be worked with a keyboard and is announced with a name and a value rather than a pointer-only drag, and the whole thing is a figure with a caption. A measuring wrapper contains the figure so fluid tokens resolve locally, both images and the bounded divider share a grid cell, and layered scoped CSS clips the second treatment using a state-driven property, with mutually exclusive LTR and RTL rules.",
    accessible:
      "The range is named, describes its current percentage, and references the caption. Both images have descriptive alt text. The server-rendered position shows half of each; the divider remains within the frame at both endpoints and has forced-colour treatment.",
  },
  composition:
    "Range is dropped in as it comes; the example holds the value in state and writes it onto the figure as a custom property the stylesheet reads.",
  tags: ["before", "after", "slider", "reveal", "photos"],
  order: 13,
};
