import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Contact details",
  description:
    "How to reach the nursery: a phone number that dials, an email that opens, the postal address and the opening hours.",
  category: "data-display",
  uses: [],
  notes: {
    modern:
      "An address element, which is contact information for the page, holding a description list; the phone is a tel link and the email a mailto link, so a tap dials or writes, and the hours are two descriptions of one term. Two columns where the block has room and stacked pairs where it has not, each layout owned outright by its own container query, with the pairs as grouping divs the wide grid sees through.",
    accessible:
      'Each label and its value are associated by the list, the address keeps its line breaks in the markup rather than in the styling, the phone number is marked dir="ltr" so its two groups keep their order in a right-to-left page, and the links keep the page\'s own link colour and underline.',
  },
  composition:
    "Element styles alone: links, terms and descriptions carry it, and the address element's italic is the only default the example turns off.",
  tags: ["address", "phone", "email", "opening hours", "footer"],
  order: 6,
};
