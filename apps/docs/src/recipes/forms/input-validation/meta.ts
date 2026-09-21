import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Input validation",
  description:
    "An email field that checks itself as you type, once you have left it: the browser's own validity, written out in plain words in a Field.Error that clears when the address is right.",
  category: "forms",
  uses: ["Field", "Input"],
  notes: {
    modern:
      'The judgment is the platform’s ValidityState on a type="email" input with required: valueMissing and typeMismatch are read, never re-implemented with a pattern, so the browser and the message agree, and the Field marks the box aria-invalid because the Field.Error is a rendered element. Nothing but a width sits in its stylesheet: the danger border, the ring and the forced-colours outline are core’s, detected from aria-invalid, and the example writes no invalid class.',
    accessible:
      "Nothing is said until the field has been left once: an error while the first character is typed is noise. From then on the message follows every edit, as an alert joined to the box by aria-describedby, and clears when the address is right, so the box stops being invalid rather than turning green. The words say what to do (Enter an email address with an @), never invalid or required.",
  },
  composition:
    "Field.Root, Label, Description, Error and Input as core ships them; the example's whole contribution is one function from validity to words and the moment to show them.",
  tags: ["validation", "email", "error", "live", "validity", "required"],
  order: 19,
};
