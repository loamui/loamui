import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Number with currency",
  description:
    "An amount box with the currency's symbol in its start section and a select of currencies beside it, in one row: the label names the amount, the select names itself.",
  category: "forms",
  uses: ["Field", "Input", "Select"],
  integration:
    "Currency changes the symbol, not the entered amount: no exchange-rate conversion is implied. Validate the amount, supported currency and gift-card limits in your application before accepting payment.",
  notes: {
    modern:
      'The amount is a text input with inputMode="decimal", so a phone offers the number pad and a decimal point without the spinner a type="number" box would add; the currency is a native <select> whose options are the three ISO codes, submitted under their own name. The row is a two-track grid with the select’s track sized to its content, and the symbol in the box is one span that changes with the select, so no width is reserved for the widest currency.',
    accessible:
      "The Field's label names the amount and its description says the bounds; the select carries its own name, Currency, in an aria-label, because it is a second control and a screen reader reaches it as one. The symbol in the box is aria-hidden: it repeats what the select already says.",
  },
  composition:
    "Core keeps buttons and selects beside a box rather than inside it, so the two share the derived control height and the box keeps its padding; the symbol is an explicit sibling placed over the input’s padding, while the native input keeps its border and focus ring.",
  tags: ["currency", "amount", "money", "number", "select", "gift card"],
  order: 15,
};
