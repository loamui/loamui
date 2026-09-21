import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Autocomplete with async data",
  description:
    "A variety picker whose suggestions arrive after a delay: a spinner in the box while the seed list is searched, then the matches, with the outcome written under the box.",
  category: "forms",
  uses: ["Combobox", "Field", "Loader"],
  integration:
    "The seed search uses a local list with a simulated delay. Replace searchSeedList with your API request and pass its AbortSignal; add a visible error and retry state for network failures.",
  notes: {
    modern:
      'The box is a native input wearing the APG editable combobox, and the chosen variety is submitted under name="variety" as a hidden input, so the form posts a value whether or not the list ever opened. The Loader’s size is the one inherited hook the example sets, on the Field, so the spinner in the end section is the size of an icon there and the box keeps the derived control height; the status line reserves a line so the field does not jump when it fills.',
    accessible:
      "The Combobox's status region is the one voice: while a search is under way it says so, and when the answer lands it says how many match, so nothing announces 0 results while the list is still coming. The spinner is aria-hidden for the same reason, and the visible status line under the box is plain text, not a second live region saying the same words.",
  },
  composition:
    "Combobox.Root, Input, List, Option and Empty as core ships them, with the example's own search in the same file: which options render is the consumer's decision, and here it is whatever the last answered search returned, the search before it abandoned through an AbortController.",
  tags: ["autocomplete", "combobox", "async", "search", "loading", "typeahead"],
  order: 13,
};
