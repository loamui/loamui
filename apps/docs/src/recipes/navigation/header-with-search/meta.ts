import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Header with search",
  description:
    "A site header with a search box: the brand, a few primary links, the site's search and the signed-in person's avatar linking to their account.",
  category: "navigation",
  uses: ["Avatar", "Nav", "Search"],
  notes: {
    modern:
      "Search renders the search landmark around a real form, so Enter, the button and a GET to /search are the browser’s; the account is a link because it goes somewhere. One flex row reflows by the header’s own width: the search grows between the nav and the account where there is room, and each takes a row of its own where there is not.",
    accessible:
      "The search box is named by a label that is read but not seen, the search button by hidden text beside its icon, and the account link the same way with the Avatar hidden, so nothing is announced twice.",
  },
  composition:
    "Nav, Search and Avatar come as they are; the header places the two landmarks from scopes of their own, moves Nav's current marker under the link by its public --loam-nav-current-edge, and never reaches inside them.",
  tags: ["site header", "search", "avatar", "account"],
  order: 2,
};
