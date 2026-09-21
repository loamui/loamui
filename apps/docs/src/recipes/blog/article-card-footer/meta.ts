import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Article card with a footer",
  description:
    "One article in a Card with a footer: a picture, a category Badge, a linked title and its opening lines, then the author, the date and the count of likes in a row at the foot.",
  category: "blog",
  uses: ["Avatar", "Badge", "Card", "Time"],
  notes: {
    modern:
      'The Card is an article with a footer element for its byline; the author is an address with rel="author", and the date is a time with a machine-readable dateTime. A flex column whose footer takes the slack with an auto margin, so in a row of cards the byline lands at the bottom of each, and the likes count is set in tabular numerals so it holds its width.',
    accessible:
      "The title is the link and the card is not, so the link's name is the title alone; the heart is hidden and the count finishes in a hidden word, so a reader hears 124 likes.",
  },
  composition:
    "Card, Badge, Time and Avatar are used as they come; the avatar size is its public property set on the footer, and the example's rule stops at each root.",
  tags: ["post", "news", "teaser", "blog card", "likes"],
  order: 8,
};
