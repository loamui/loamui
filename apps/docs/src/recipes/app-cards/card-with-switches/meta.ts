import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Card with switches",
  description:
    "Notification preferences in a Card: a Fieldset of rows, each a label and a line of description beside a Switch that the label names.",
  category: "app-cards",
  uses: ["Card", "Fieldset", "Switch"],
  notes: {
    modern:
      "The group is a fieldset with a legend, so the switches are announced as Notifications; each toggle is a native checkbox with role switch, named by a real label element and described by the paragraph beside it. Each row is a two-column grid with the words taking the slack and the toggle centred on them, and the lines between rows are borders, so they survive forced colours.",
    accessible:
      "A switch says on or off, so a reader hears Order updates, switch, on; the description is joined by aria-describedby rather than sitting loose under the label.",
  },
  composition:
    "Switch.Control is the bare toggle, wired to its own label and description by id, because the row's layout is the example's rather than the labelled row Switch draws on its own.",
  tags: ["settings", "preferences", "notifications", "toggles", "switch"],
  order: 6,
};
