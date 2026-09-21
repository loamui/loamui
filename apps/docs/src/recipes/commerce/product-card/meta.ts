import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Product card",
  description:
    "One product in a listing: a picture, a linked name, its rating and review count, a reduced price with the old one struck through, and one action.",
  category: "commerce",
  uses: ["Badge", "Button", "Card", "Price", "Rating"],
  notes: {
    modern:
      "The Card is rendered as an article named by its heading, the old price is an s element, and each price is a data element whose value is the number for machines. A flex column with the action’s auto margin taking the slack, so every button in a row of cards lands at the same foot, and the picture is cropped square by aspect-ratio and object-fit. The offer sits in a success region and the action in a primary one, so the Badge and the Button take their colours from where they are rather than from a prop; primary is the brand slot, neutral until a theme fills it, so the row says where the action belongs rather than making it stand out.",
    accessible:
      'The name is the link and the card is not; the reduction is read as "Was £3.50 Now £2.80" through hidden words rather than left to the strike; the button\'s name is "Add Climbing bean ‘Blue Lake’ seeds to basket", so a listing of buttons tells them apart.',
  },
  composition:
    "Card, Rating, Price, Badge and Button are used as they come; the Rating takes the row's small type and the Prices take the paragraph's, since neither sizes itself.",
  tags: ["shop", "listing", "price", "sale", "add to basket"],
  order: 1,
};
