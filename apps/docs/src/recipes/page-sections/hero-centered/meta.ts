import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Hero centred",
  description:
    "A page-opening section with no picture: an eyebrow, a headline, a lede and two actions, centred.",
  category: "page-sections",
  uses: ["Badge", "SignpostLink"],
  notes: {
    modern:
      "A section named by its own h1, so it is a region in a screen reader’s landmark list; the type is the element styles’ own, at the top of the fluid scale. One grid column with justify-items and text-align centres every part, the headline is balanced and the lede capped at the measure token so neither runs long. The eyebrow declares --loam-context: primary, so the Badge takes the brand colour without a prop; primary is the brand slot, neutral until a theme fills it, and the eyebrow reads as one by its place above the heading.",
    accessible:
      "The primary path is a SignpostLink and the alternative a plain link, both going somewhere; nothing here is a button pretending to be one.",
  },
  composition:
    "Badge in the eyebrow and SignpostLink in the actions, as they come; nothing here is a Button, because both paths lead to a page.",
  tags: ["landing", "marketing", "membership", "centred"],
  order: 2,
};
