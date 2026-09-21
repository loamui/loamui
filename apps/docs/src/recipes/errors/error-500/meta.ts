import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Something went wrong",
  description:
    "A 500 page: the code, what happened in plain words, a button that tries the page again, and a way to tell someone.",
  category: "errors",
  uses: ["Button"],
  notes: {
    modern:
      "A section named by its own h1, because the error is the page; trying again is a button, because it does something, and telling someone is a link, because it goes somewhere. The page is a container so its type answers its own width, the title balances its lines and the description wraps prettily, with nothing sized to a viewport. The row of ways out declares --loam-context: primary, so the Button is the main action without a prop; primary is the brand slot, neutral until a theme fills it, and the Button is told from the plain link beside it by being a Button, not by its colour.",
    accessible:
      "The copy says it was not the reader's doing and that nothing is lost before it asks them to try again; the illustration is hidden because the words already say it.",
  },
  composition:
    "The illustration is an inline SVG in the markup, stroked in currentColor with two coloured parts, so a reader recolours or redraws it in place; Button is dropped in as it comes.",
  tags: ["500", "server error", "try again", "error page"],
  order: 2,
};
