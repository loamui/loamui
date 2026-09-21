import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Inline search form",
  description:
    "A site search as it sits in a header: the search landmark with a box and an icon button on one line.",
  category: "forms",
  uses: ["Search"],
  notes: {
    modern:
      'A native <search> landmark around a native form: Enter in the box or the button submits a GET to the action with the query under q, and type="search" keeps the platform’s own clear affordance. The landmark’s own grid puts the box and the button on one row, and the example adds a width cap that shrinks with the header rather than a breakpoint.',
    accessible:
      'The box is named by a label that is read but not seen, so the placeholder is a hint and never the name; the landmark is named "Search the catalogue" so a second search on the page is told apart in a landmark list; the button\'s name is hidden text, not the icon.',
  },
  composition:
    "Search.Root, Label, Input and Button as core ships them; the icon and its hidden word are ordinary children the Button detects as icon-only.",
  tags: ["search", "header", "site search", "landmark"],
  order: 12,
};
