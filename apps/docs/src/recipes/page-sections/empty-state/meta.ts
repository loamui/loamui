import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Empty state",
  description:
    "What an orders page shows before there is anything in it: a picture, what the place is for, and one next step, in a Card.",
  category: "page-sections",
  uses: ["Card", "SignpostLink"],
  notes: {
    modern:
      "A heading and a paragraph in a div: the Card already holds it, and a list that loaded empty is the page as it is, so there is no landmark and no live region to announce nothing happening. One centred grid column caps the paragraph at the measure token; the Card decides the width and the fluid tokens answer it.",
    accessible:
      "The picture is aria-hidden because the title already says what it shows, and the next step is a single link rather than a menu of them.",
  },
  composition:
    "Card is rendered as the root div through render, so the surface and the column are one element, and SignpostLink is the one next step; neither's own styles are touched.",
  tags: ["empty", "no results", "onboarding", "orders"],
  order: 16,
};
