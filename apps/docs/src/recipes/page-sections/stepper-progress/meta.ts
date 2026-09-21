import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Stepper progress",
  description:
    "An order's progress through four steps: the ones done, the one under way and the ones to come, under a header that names the order.",
  category: "page-sections",
  uses: ["Stepper"],
  notes: {
    modern:
      "The order lives in an ol, so a screen reader announces 2 of 4 from the list itself; the placed date is a time element with its machine-readable value. The Stepper stacks in a narrow container and runs as a row where it has 40rem, decided by its own width, and the example adds only the spacing between header, steps and the way back. One aria-current=step on the step reached is the whole state: the stylesheet reads done, current and upcoming from it, and it is also what assistive technology announces.",
    accessible:
      "The list is named for the order it tracks, the current and completed steps carry hidden words after their titles, and the state survives forced colours as dashed and solid lines.",
  },
  composition:
    "Stepper.Root, Step, Marker, Title and Description are arranged in the markup; an empty Marker draws its number or its check, and nothing is configured through a prop.",
  tags: ["order", "tracking", "steps", "progress", "status"],
  order: 18,
};
