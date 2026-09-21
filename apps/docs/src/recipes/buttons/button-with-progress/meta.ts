import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Button with progress",
  description:
    "An Upload photos button that disables itself while the upload runs and shows a real progress bar along its foot, then says in words that the photos are up.",
  category: "buttons",
  uses: ["Button", "Progress"],
  notes: {
    modern:
      "The bar is a native <progress> with a value, not a div with a width: the browser paints the fill and exposes the percentage. It is a sibling of the button laid over its edge, because a <button> may hold only phrasing content, and the button is disabled with the attribute, so a second click cannot start a second upload. The stack is a one-cell inline grid: the Button fills it by auto-placement and the bar is placed into the same cell by grid-area and aligned to the end, so nothing is measured or absolutely positioned. It declares --loam-context: primary because the Button and its bar are the one action; primary is the brand slot, neutral until a theme fills it, and a theme that does recolours both as one.",
    accessible:
      "The button's words say what is happening (Uploading 5 photos…) and the bar is named Upload progress with its value read as 40% uploaded; when the upload finishes, a polite status region says 5 photos uploaded, so a screen reader hears the end even though the disabled button could not keep focus. The bar keeps its border and Highlight fill in forced colours.",
  },
  composition:
    "Button and Progress as core ships them, with the example's own timer standing in for the request's progress events; the words in the button change with the state, and the confirmation is a status paragraph under it.",
  tags: ["upload", "progress", "button", "disabled", "loading", "async"],
  order: 3,
};
