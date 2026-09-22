import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Subgrid rows",
  description:
    "Three cards whose heading, description and action rows line up across the grid, whatever the length of the words, through grid-template-rows: subgrid.",
  whenToUse:
    "Use when cards with different amounts of text need aligned headings, descriptions and actions. Choose Asymmetric grid when one item should lead.",
  category: "grids",
  uses: ["Card", "SignpostLink", "VisuallyHidden"],
  integration:
    "Replace the sample workshops and booking destinations, including the dates and local times. State the venue and time zone in the surrounding event information. Use heading levels appropriate to that page.",
  notes: {
    modern:
      "A list of three items, each a card named by its h3, so the row of workshops is a list to a screen reader and each card says what it is. A measuring wrapper contains an intrinsic grid: each Card spans three parent rows and inherits them with subgrid, including the shared row gaps, and the three content regions measure their own text. The subgrid itself has no size containment, which would break row sharing, so no fixed heights or JavaScript measurements are needed.",
    accessible:
      "Workshops have named list items, dates with machine-readable local date-times and booking links that include the workshop title in their accessible names. Source order stays heading, description, then action as the grid reflows.",
  },
  composition:
    "Card is rendered as the list item through its render prop, which is what lets the Card be the grid item that subgrids; the SignpostLink inside is past the donut and the Card's padding becomes the gutter of its tracks.",
  tags: ["grid", "subgrid", "layout", "cards", "align"],
  order: 3,
};
