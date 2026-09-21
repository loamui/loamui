import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Stats with controls",
  description:
    "A day's figures from the packing shed: Previous and Next Buttons around the date, and three Meters showing where each figure sits against the day's capacity.",
  category: "data-display",
  uses: ["Button", "Card", "Meter", "Time"],
  notes: {
    modern:
      "The bars are native meter elements, because each figure sits within a known range rather than progressing toward an end; the date is a time element and the tiles are one description list. The tiles are an auto-fit grid answering the section’s width; the figures are tabular lining numerals so they hold their width as the day changes under them, and the Meter’s track reads because it sits on the Card’s surface rather than a tinted tile.",
    accessible:
      "The buttons at the ends of the range are aria-disabled rather than disabled, so the one just pressed keeps focus; each meter is named for what it measures and each figure is written out with its capacity.",
  },
  composition:
    "The page holds the day in state and hands each Meter its value and the capacity as max; each tile is a Card rendered as the list's grouping div, and the Meters, the Buttons and the Time are dropped in as they come.",
  tags: ["daily", "metrics", "meter", "capacity", "date picker", "dashboard"],
  order: 11,
};
