import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Side nav with segmented control",
  description:
    "Vertical navigation in two sections, Account and Shop, switched by a segmented control above the list; the page holds which is shown.",
  category: "navigation",
  uses: ["Nav", "SegmentedControl"],
  notes: {
    modern:
      "The switch is a native radio group in a fieldset, so the arrow keys move between Account and Shop as they do on any radios, and the chosen segment is drawn from the radio’s own :checked; the list not chosen is hidden with the hidden attribute. The pill is core’s at its natural width, and the chosen state moves to the system highlight under forced colours in SegmentedControl’s stylesheet rather than here, so the example’s stylesheet is a single rule for the column.",
    accessible:
      "The radio group is named Section by a legend that is read but not seen, each nav is named for its section so a landmark list says which is shown, and the current page stays marked in the Account list where it lives.",
  },
  composition:
    "SegmentedControl reports the choice through onValueChange and the example keeps it in state; both lists are written out in the markup, each in its own Nav, and the one not chosen is hidden on an element of the example's own, so Nav knows nothing of the switch.",
  tags: ["sidebar", "segmented control", "radio", "sections", "switch"],
  order: 14,
};
