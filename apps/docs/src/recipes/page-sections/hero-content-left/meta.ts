import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Hero with content left",
  description:
    "A page-opening section with the headline, lede and actions on the start side and an illustration on the end side that drops below when there is no room.",
  category: "page-sections",
  uses: ["Button", "SignpostLink"],
  notes: {
    modern:
      "A section named by its h1; the illustration is inline SVG drawn in currentColor, so it is styled by the same cascade as the words and needs no image file. The section is a container and the inner element the grid: one column with the picture last, two columns at 48rem of the section’s own width, decided by the section rather than the viewport. The drawing’s lines are the strong primary token and its fills the soft one, so a themed primary re-colours the picture along with everything else.",
    accessible:
      "The illustration is aria-hidden because the headline says what it shows, and in forced colours the fills go to Canvas and the lines to CanvasText so the drawing stays a drawing.",
  },
  composition:
    "Button for the thing to do and SignpostLink for the place to go; the illustration is the example's own svg, so no component is bent into a picture.",
  tags: ["landing", "marketing", "illustration", "split"],
  order: 22,
};
