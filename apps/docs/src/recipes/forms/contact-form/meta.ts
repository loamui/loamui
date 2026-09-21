import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Contact form",
  description:
    "Getting in touch: a name, an email, a subject to choose and a message, in one column with one action at the end.",
  category: "forms",
  uses: ["Button", "Field", "Input", "Select", "Textarea"],
  notes: {
    modern:
      "A native form named by its heading, with a native select for the subject that starts on a disabled prompt so a skipped subject submits nothing rather than the first option, and required catches it. The form is its own container and its own grid, capped at a readable width, so the fields answer the form’s width rather than the viewport’s. The actions row declares --loam-context: primary because the one Button is the form’s action; primary is the brand slot, neutral until a theme fills it, so the declaration says where the action belongs, not that it stands out.",
    accessible:
      "One column, always: a form is filled top to bottom, and fields set side by side make the eye and the tab order disagree. The note says when to expect a reply before anyone starts typing, the email field says what it is for, and the Button says what happens.",
  },
  composition:
    "Every field is a core Field around a core control; the example adds only the opening, the rhythm between fields and the actions row.",
  tags: ["contact", "enquiry", "message", "support"],
  order: 5,
};
