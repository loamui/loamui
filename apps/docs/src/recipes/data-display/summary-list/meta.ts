import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Summary list",
  description:
    "Label and value rows of a member's account, each with a link to change it, named for what they summarise.",
  category: "data-display",
  uses: ["Time"],
  notes: {
    modern:
      "A description list: each label is a term and its value the description, grouped in a div per row so the pair and its link stay together, under a heading that names the section. The list is a three-column grid and every row a subgrid of it, so the change links share one column down the list and the values stay aligned whether or not a row has a link.",
    accessible:
      "Every link says what it changes, with the object visually hidden after the verb, so a screen reader's list of links reads Change name, Change plot, Add phone number rather than Change six times; a missing value is written as Not provided, never left blank.",
  },
  composition:
    "Element styles carry the rows; the only component is Time, dropped into a value so the renewal date is machine-readable while the words are the page's own.",
  tags: ["account", "check your answers", "key value", "details"],
  order: 3,
};
