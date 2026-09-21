import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Card with icon features",
  description:
    "A succulent bowl in a Card: a photograph, a gift Badge, a feature list, a Price and a link to the product page.",
  category: "app-cards",
  uses: ["Badge", "Card", "Price", "SignpostLink"],
  notes: {
    modern:
      "The Card is an article named by its heading, the price is a data element whose value is the number for machines, and the features are a list named for what it lists. The foot is a wrapping flex row, so the price and the SignpostLink share a line where there is room and stack where there is not, and the icons are sized in em to the text beside them. The flag is an info region, so the Badge takes the colour from where it sits rather than from a prop, and the words explain the category as well as its colour.",
    accessible:
      "The product link names its destination, the photo describes the actual planting, and decorative feature icons are hidden from assistive technology.",
  },
  composition:
    "Price writes the amount and dresses the qualifier written as its child; Badge and SignpostLink come as they are, and the example only arranges the column between them.",
  tags: ["product", "shop", "features", "price", "plants"],
  order: 4,
};
