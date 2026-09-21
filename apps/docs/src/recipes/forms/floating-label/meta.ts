import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Floating label",
  description:
    "A name field whose label sits in the box until the box is focused or filled, then rises above it and stays there: a label in the box's position, never a placeholder standing in for one.",
  category: "forms",
  uses: ["Field", "Input"],
  notes: {
    modern:
      "A real <label for> on a real input: the words are the control’s name in every state, and clicking them focuses the box. The placeholder is one space, there only so :placeholder-shown answers whether the box is empty; no hint is hidden in it. The two positions are one :has() on the field, input:focus or input:not(:placeholder-shown), with no script watching the value, and the rise is a transition on inset and font-size behind prefers-reduced-motion.",
    accessible:
      "A label that stays visible once the field is filled is what tells a floating label from a placeholder: the question is still on the page when the answer is being checked. The resting words are muted but AA-readable; the raised words take the text colour, and primary while the box has focus, so the state is carried by position and weight, never colour alone.",
  },
  composition:
    "Core Field with an id of the example's choosing, so the example's own label and core's Input agree on the control by name; the Input is untouched past the donut, and the label's resting place is derived from the box's own border and padding tokens.",
  tags: ["floating label", "label", "placeholder", "input", "animation"],
  order: 14,
};
