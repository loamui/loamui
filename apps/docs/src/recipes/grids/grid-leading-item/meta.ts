import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Grid with leading item",
  description:
    "A three-column grid whose lead item spans two columns above a row of three, with a narrower item beside the lead; two columns, then one, as the room goes.",
  category: "grids",
  uses: ["Badge", "Card", "SignpostLink"],
  notes: {
    modern:
      "A list of five articles, each named by its h3, in an order that reads as the layout does: the lead first, then the side note, then the three guides. An outer region is the named container and the list is the grid, and each width owns its layout outright — one column, two from 36rem with the lead across both, three from 56rem with the lead across two — so no rule of one width overrides another. The lead’s eyebrow declares --loam-context: primary, so the Badge takes the brand colour from the region rather than a prop; primary is the brand slot, neutral until a theme fills it, and the lead is the lead by its span, its type and the Badge’s words.",
    accessible:
      "Every card's action is a link at its foot, in the same place five times; the lead is the lead by its type and span, with the Badge's words saying so for anyone who cannot see either.",
  },
  composition:
    "Card is rendered as each article through its render prop; the lead's larger type comes from a scope of its own on the lead's card, not a prop, and the Badge and SignpostLink are past the donut.",
  tags: ["grid", "layout", "cards", "lead", "featured", "columns"],
  order: 2,
};
