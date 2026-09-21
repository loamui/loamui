import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Asymmetric grid",
  description:
    "A 2:1 grid: a tall lead card with a photograph in the wide column and two cards stacked beside it, all in one column when narrow.",
  whenToUse:
    "Use to give one item prominence beside two supporting items while preserving reading order. Choose Subgrid rows when equal items need their content aligned.",
  category: "grids",
  uses: ["Card", "SignpostLink"],
  integration:
    "Replace the sample notices and destinations, and adjust heading levels to the page. Keep the lead item first in the source. Change the responsive image sources and alt description together.",
  notes: {
    modern:
      "A list of three articles, each named by its own h3, so the grid is a list to a screen reader and each card a named piece; no wrapper element exists only to be a column. A named outer container measures the list, and mutually exclusive queries switch between one column and a 2:1 layout at 44rem while retaining source order; each Card measures its own content, and scoped rules in loamui.components arrange it without changing the surface.",
    accessible:
      "The photograph carries real alt text because a picture of the orchard is what the lead is about; the actions are links because each goes somewhere, and every card's action sits at its foot so the eye finds it in the same place three times.",
  },
  composition:
    "Card is rendered as each article through its render prop; the example arranges the column inside, the SignpostLink is past the donut, and the Card's padding and line are left alone.",
  tags: ["grid", "layout", "cards", "lead", "columns"],
  order: 1,
};
