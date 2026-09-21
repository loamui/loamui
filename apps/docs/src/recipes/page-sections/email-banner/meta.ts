import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Email banner",
  description:
    "A newsletter signup bar: a title, a line on what the letter is, an email field with its button beside it, and an illustration where there is room.",
  category: "page-sections",
  uses: ["Button", "Field", "Input"],
  notes: {
    modern:
      "A native form that submits the email to its action: Enter in the box or the button sends it, with required and type=email catching a slip before anything is posted. The section paints the subtle surface and is the container: at 40rem of its own width the illustration takes a column beside the words, and below it is left out rather than pushed under the form. The action cell declares --loam-context: primary because the Button is the form’s action; primary is the brand slot, neutral until a theme fills it, so the cell says where the action belongs rather than making it stand out.",
    accessible:
      "The box has a visible label, not a placeholder standing in for one; the illustration is aria-hidden; and the tint gets a border in forced colours with the drawing's fills going to Canvas.",
  },
  composition:
    "Field, Input and Button as core ships them; the field and the button share one derived height, so aligning the row to its end puts the button level with the box under the label without a number.",
  tags: ["newsletter", "subscribe", "signup", "email", "banner"],
  order: 28,
};
