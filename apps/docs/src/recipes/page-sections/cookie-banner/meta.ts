import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Cookie banner",
  description:
    "A consent banner in the flow of the page: a title, two paragraphs, the choices as submit buttons, then a confirmation the reader can hide.",
  category: "page-sections",
  uses: ["Button"],
  notes: {
    modern:
      "A section named by its title, so it is a landmark a screen reader can list; the choices are submit buttons in a post form with name and value, so a server records them before any JavaScript runs. The banner sits in flow on the subtle background with a line beneath, never fixed over the page, and the empty confirmation grid has no height, so it costs no room until it is filled.",
    accessible:
      "The confirmation is a role=status mounted empty so the outcome announces; focus moves to its Hide button because the one pressed has gone, and hiding moves focus on to the next thing the reader could have tabbed to.",
  },
  composition:
    "Two Buttons and a link in a form the example writes; the open state, the choice and the focus moves are the page's own, held in the component that renders the banner.",
  tags: ["consent", "cookies", "gdpr", "privacy", "form"],
  order: 17,
};
