import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Choice cards with radios",
  description:
    "Three membership plans as cards, each the label of a real radio, with the chosen one marked by an edge as well as its dot.",
  category: "forms",
  uses: ["Card", "Radio", "RadioGroup"],
  integration:
    "Pass a name such as plan when integrating with a form endpoint. When omitted, RadioGroup generates a unique name so multiple copies on one page remain independent. Supply the real membership options and submit the selected value in your application.",
  notes: {
    modern:
      "A RadioGroup shares the name and the default, and each card is a <label> around a native radio, so the whole surface is the click target and the arrow keys move the choice as on any radio set; the state lives in the input, not on the card. Checked is detected from the input with :has(), never declared on the card: an outline in the Card’s own line’s place, and a focus ring around the card when the radio inside has keyboard focus. That edge uses the -strong primary so it holds 3:1 in both schemes, and moves to the system Highlight in forced colours where a painted edge would be dropped.",
    accessible:
      'The radio is named by the title alone through aria-labelledby and described by the price line through aria-describedby, so a screen reader hears "Grower, radio, 2 of 3" and then the detail, not one run-on name. Chosen is the dot plus the edge, never colour alone.',
  },
  composition:
    "Card is rendered as the label and left as core styles it; the example lays out the control, the title and the description inside and draws only the checked edge.",
  tags: ["plans", "pricing", "membership", "radio cards", "options"],
  order: 9,
};
