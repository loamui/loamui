import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Vertical article card",
  description:
    "A narrow Card for a column of teasers: a portrait picture, a category Badge, a linked title, and the author and date in a row at the foot.",
  category: "blog",
  uses: ["Avatar", "Badge", "Card", "Time"],
  notes: {
    modern:
      'The Card is an article named by its heading, the author sits in an address with rel="author", and the date is a time with a machine-readable dateTime. The picture is held to a portrait ratio so a column of these cards lines up whatever the files’ shapes, and the card caps its own width while a grid of them sets the columns.',
    accessible:
      "The title is the link and the card is not, so the link's name is the title alone; the picture describes the flowers shown; the avatar is hidden because the name is printed beside it.",
  },
  composition:
    "Card, Badge, Time and Avatar are used as they come; the avatar size is its public property, set on the author row rather than passed to the Avatar.",
  tags: ["post", "teaser", "column", "narrow", "blog card"],
  order: 10,
};
