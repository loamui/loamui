import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Side nav with two sections",
  description:
    "Vertical navigation for an application in two lists: the main pages at the top and, pinned to the foot of the column, settings and a sign-out that posts a form.",
  category: "navigation",
  uses: ["Nav"],
  notes: {
    modern:
      'Sign out is a submit button in a method="post" form, because ending a session changes state on the server; it is rendered through Nav.Link, whose stylesheet sets a button as one line among the links, and the other five are real anchors. Nav’s own grid stretches its rows: the title and the main list share a wrapper of the example’s own pinned to the start of the first row, and the account list is pinned to the end of the second, so it sits at the block end however tall the column is; nothing is positioned, and the separator is a border on the second list.',
    accessible:
      "One landmark named Nursery holds both lists, so a reader finds settings and sign out under the same name; the current page carries aria-current and the sign-out button keeps its own semantics inside the list.",
  },
  composition:
    "Two Lists in one Root: Nav has no footer part, because a second List, a wrapper and two align-self values are all the pinning needs; the example writes nothing onto Nav's grid and never reaches inside a link, the sign-out button included.",
  tags: ["sidebar", "app shell", "vertical nav", "sign out", "settings"],
  order: 10,
};
