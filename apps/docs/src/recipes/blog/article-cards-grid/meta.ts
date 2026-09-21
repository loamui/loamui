import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Article cards grid",
  description:
    "Three article cards in a list: one column when narrow, two when wide, with the first card taking the whole row as the lead.",
  category: "blog",
  uses: ["Avatar", "Badge", "Card", "Time"],
  notes: {
    modern:
      'A ul of articles, each a Card rendered as an article named by its heading; the list says role="list" because stripping its markers drops the role in some browsers. The list is the grid and every item is a container, so the lead card lays its picture beside the text as soon as it is wide enough, decided by the item’s width rather than a breakpoint.',
    accessible:
      "A screen reader's list of articles reads the three titles, each link's name is its title alone, and the pictures illustrate titles already read, so their alt is empty.",
  },
  composition:
    "The grid is the example's own three lines of CSS: no layout component, and the card inside is exactly the single Article Card example.",
  tags: ["index", "listing", "featured", "blog grid"],
  order: 2,
};
