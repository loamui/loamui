import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Page not found with an illustration",
  description:
    "A 404 page in two columns: the code, what happened and a way back on one side, a drawing of an empty pot on the other.",
  category: "errors",
  uses: ["SignpostLink"],
  notes: {
    modern:
      "A section named by its own h1, because the error is the page; the code is a paragraph, not a heading, so the outline reads Nothing is growing here and not 404. The page is a container: one column with the picture under the words where it is narrow, two columns with the picture at the end where it is wide, and nothing is sized to a viewport.",
    accessible:
      "The illustration is hidden from assistive technology because the words already say it; the way back is a SignpostLink because it goes somewhere, and the copy says what to do without blaming the reader.",
  },
  composition:
    "The illustration is an inline SVG in the markup, stroked in currentColor with a few parts coloured by token, so a reader recolours or redraws it in place; SignpostLink is dropped in as it comes.",
  tags: ["404", "not found", "missing", "error page", "illustration"],
  order: 3,
};
