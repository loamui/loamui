import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Page header",
  description:
    "The top of a page inside an application: where it sits, what it is, a line about it, a row of facts and the actions that act on the whole page.",
  category: "navigation",
  uses: ["Badge", "Breadcrumbs", "Button", "Time"],
  notes: {
    modern:
      "A header named by the page’s one h1 through aria-labelledby, so a landmark list says which page’s header it is; the date is a time element with a machine-readable dateTime. A two-column grid answered by the header’s own width pins the text to the first column and lets the actions flow beside it where there is room, beneath it where there is not. The status fact is a success region and Request seed sits in a primary one, so the Badge and the Button take their colours from where they sit without a prop between them; primary is the brand slot, neutral until a theme fills it, so the main action is told by its place, last in the row, not by colour.",
    accessible:
      "Breadcrumbs come first because where the page sits is read before what it is; the facts are a list, not headings; the actions come last, beside the title only visually.",
  },
  composition:
    "Breadcrumbs, Badge, Time and Button are dropped in as they come, and the grid places the Breadcrumbs by flow rather than by reaching into their root.",
  tags: ["breadcrumbs", "title", "actions", "app shell", "record"],
  order: 9,
};
