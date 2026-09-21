import type { ExampleMeta } from "@/examples/types";

export const meta: ExampleMeta = {
  title: "Choice cards with checkboxes",
  description:
    "Add-ons as cards, any number of which can be ticked, each with a line saying what it includes and costs; one is not on offer.",
  category: "forms",
  uses: ["Card", "Checkbox", "Fieldset"],
  notes: {
    modern:
      "A fieldset names the set and each card is a <label> around a native checkbox sharing one name, so the form submits every ticked value under it and the whole surface is the click target. Checked and disabled are detected from the input with :has(), never declared on the card; the disabled option fades its words while the Card keeps its line, so it still reads as one of the set. The checked edge uses the -strong primary so it holds 3:1 in both schemes, and moves to the system Highlight in forced colours, where the disabled words go to GrayText instead of fading.",
    accessible:
      "Each checkbox is named by its title alone through aria-labelledby and described by the detail through aria-describedby, so a screen reader hears the option and then what it costs; the option that cannot be chosen says why in its description rather than vanishing.",
  },
  composition:
    "Card is rendered as each label through render and a Checkbox with no label of its own is the bare control a Field would otherwise wire; the example puts the three parts on a two-column grid and adds the checked edge, nothing of the Card's own.",
  tags: ["add-ons", "extras", "checkbox cards", "options", "membership"],
  order: 10,
};
