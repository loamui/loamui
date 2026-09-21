import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Side nav with search",
  description:
    "Vertical navigation with a search box at the top, counts on the links that have something waiting, and the signed-in person at the foot linking to their account.",
  category: "navigation",
  uses: ["Avatar", "Badge", "Nav", "Search"],
  notes: {
    modern:
      "Search renders the search landmark around a real form with one text box, so Enter submits it by the browser’s own rule and no button is needed; the account row is a link because it goes somewhere. Three grid rows, the middle one 1fr, pin the account to the foot without positioning, and inside a link the words grow to fill the line, which is what pushes the count to the end.",
    accessible:
      "Each count carries hidden words, so the link is named Orders 12 to pack rather than Orders 12; the search box is named by a label that is read but not seen, and the Avatar is hidden because the name is printed beside it.",
  },
  composition:
    "A Badge is an ordinary child of Nav.Link beside the icon and the words; Nav's scope stops at it, so the count keeps Badge's own pill and the example touches neither.",
  tags: ["sidebar", "search", "badge", "count", "account", "avatar"],
  order: 13,
};
