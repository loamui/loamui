import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Input with button",
  description:
    "A newsletter sign-up as one control row: the email box with its submit button level beside it, stacking under it where the row is too narrow.",
  category: "forms",
  uses: ["Button", "Field", "Input"],
  notes: {
    modern:
      'A native form: Enter in the box or the button posts the address to the action, and required plus type="email" let the browser refuse an empty or malformed one before anything is sent. The row is a two-track grid scoped at itself, because it sits inside the Field the donut fences off, and a container query answered by the form collapses it to one track under 24rem, so the same markup is a row in a footer and a stack in a sidebar without a breakpoint. The action cell declares --loam-context: primary because the Button is the form’s action; primary is the brand slot, neutral until a theme fills it, so the cell says where the action belongs rather than making it stand out.',
    accessible:
      "The Field names and describes the box; the button is named for its action, Subscribe, and is a submit, so the form works from the keyboard with Enter alone. Stacked, the button takes the box's width, a bigger target where the space is tight.",
  },
  composition:
    "Core keeps the button beside the box rather than inside it, the way its own Search and PasswordInput do: both take the derived control height, so they align by construction and the box keeps its padding. The primary look is a context on the action cell, not a prop on the Button.",
  tags: ["newsletter", "subscribe", "input", "button", "row", "email"],
  order: 20,
};
