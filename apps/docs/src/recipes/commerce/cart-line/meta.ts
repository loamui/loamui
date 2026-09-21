import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Cart line",
  description:
    "One item in a basket: a thumbnail, the product linked to its page, the options chosen, a quantity control, the total with the unit price under it, and a way to remove it.",
  category: "commerce",
  uses: ["Button", "Field", "Price", "QuantityInput"],
  integration:
    "Quantities, totals, removal and undo work locally. Supply product data, replace the product link, and persist basket changes in your application. Prices and stock must be confirmed by your checkout service.",
  notes: {
    modern:
      "The line is an article named by its heading, the quantity is one native number input inside a labelled Field, and each amount is a data element carrying the number. Named grid areas place every part, and a narrower line rearranges them by container query: the totals fold under the name and the control shares the last row with the remove action. The remove action is a neutral Button on purpose: taking a packet out of a basket is not a destructive act, so it is not in a danger region.",
    accessible:
      'The Field\'s label is real text hidden from view, so a screen reader hears "Quantity of Climbing bean ‘Blue Lake’ seeds" rather than "Quantity" three times in a basket, and the remove button names the product the same way; the thumbnail\'s alt is empty because the name is beside it.',
  },
  composition:
    "QuantityInput self-wires from the Field around it, so the label, id and any error reach the input without a prop; the example derives its Price from the valid quantity and unit price.",
  tags: ["basket", "cart", "quantity", "line item", "checkout"],
  order: 3,
};
