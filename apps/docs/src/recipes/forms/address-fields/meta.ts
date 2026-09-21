import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Address fields",
  description:
    "A postal address asked for line by line under one legend, each line carrying the autofill purpose a browser fills a saved address into.",
  category: "forms",
  uses: ["Field", "Fieldset", "Input", "Select"],
  notes: {
    modern:
      'A native fieldset named by its legend, and one input per part of the address: a single multi-line box cannot be autofilled, validated or read back a part at a time. Every purpose carries "section-delivery shipping", so a browser fills this group from the saved delivery address and leaves a billing group on the same page alone. The lines are a grid of the example’s own inside the Fieldset, so the group spaces itself as a form spaces its fields without touching the Fieldset’s own stack.',
    accessible:
      "The order is the one autofill and the reader both expect: street, town, region, code, country. The postcode is a text field, never numeric, because a UK postcode carries letters and a space and a numeric keypad would strip a leading zero; its short box says what length of answer fits. The country starts on a disabled prompt so a skipped line submits nothing rather than the first country in the list.",
  },
  composition:
    "Each line is a core Field around a core Input or Select; the example fixes only the order and the purposes; the words are the reader's, so a US form swaps City, State and ZIP code onto the same lines.",
  tags: ["address", "checkout", "delivery", "shipping", "autofill", "postcode"],
  order: 6,
};
