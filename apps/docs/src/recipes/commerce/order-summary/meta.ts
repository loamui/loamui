import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Order summary",
  description:
    "The money lines of a basket: subtotal, delivery with a note, a discount, a total set apart, and the way on to payment.",
  category: "commerce",
  uses: ["Price", "SignpostLink"],
  notes: {
    modern:
      "A description list under a heading that names it: each line is a term and its amount, the note is a second description of the delivery line, and the total is one more row rather than a different element. Every row is a subgrid of the list, so the amounts share a column and stack on their decimal, and the total’s weight and heavier rule are one nested rule on the row.",
    accessible:
      "The total is named Total in words, not only by weight, the delivery note sits on the page rather than in a tooltip, and going on to payment is a link, because it goes somewhere.",
  },
  composition:
    "Each amount is a Price, a data element whose text is written for people and whose value is the number, so a script can read the total the page shows; the example only places it.",
  tags: ["basket", "checkout", "receipt", "money", "commerce"],
  order: 5,
};
