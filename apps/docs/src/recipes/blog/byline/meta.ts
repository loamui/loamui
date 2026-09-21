import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Byline",
  description:
    "Who wrote an article and when: an avatar, the author linked to their profile, the published and updated dates and the reading time, on one line.",
  category: "blog",
  uses: ["Avatar", "Time"],
  notes: {
    modern:
      'The author’s name sits in an address element, which HTML reserves for the contact information of an article’s author, around a link with rel="author"; the dates are time elements. The dots between the parts are generated content drawn before every span that follows the address, so the parts can be reordered or dropped and the dots still fall only between them.',
    accessible:
      "The avatar is hidden because the name is printed beside it, the dots have an empty alternative so they are never read, and the second date says Updated in text rather than a tooltip, so a listener learns which date is which.",
  },
  composition:
    "Avatar and Time are used as they come; the row sets the small muted type and the Times take it, as a Time takes the type of whatever it sits in.",
  tags: ["author", "date", "reading time", "meta"],
  order: 4,
};
