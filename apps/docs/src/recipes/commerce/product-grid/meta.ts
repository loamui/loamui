import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Product grid",
  description:
    "Four product cards in a list that fits as many across as it has room for, every button landing at the same foot.",
  category: "commerce",
  uses: ["Badge", "Button", "Card", "Price", "Rating"],
  notes: {
    modern:
      'A ul of products, each a Card rendered as an article named by its heading; the list says role="list" because stripping its markers drops the role in some browsers. One auto-fit grid rule decides the columns from the list’s own width, and each card’s percentage height resolves against the item the grid stretched, so the actions line up across a row. Every card’s action row is a primary region and its offer a success one, so four Buttons and a Badge are coloured by two declarations rather than five props; primary is the brand slot, neutral until a theme fills it, and a theme that does recolours all four at once.',
    accessible:
      'Four identical-looking buttons have four different names, each ending in its product, and each review count reads "reviews" to a screen reader while showing only the figure.',
  },
  composition:
    "The grid is the example's own CSS and the card inside is the Product Card example unchanged; the offer and the old price appear only on the product that has them.",
  tags: ["shop", "listing", "catalogue", "category page"],
  order: 2,
};
