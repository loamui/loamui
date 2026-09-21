import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Comment thread",
  description:
    "A comment with two replies: the replies are a named list inside the parent, stepped in once and marked by a rule.",
  category: "blog",
  uses: ["Avatar", "Badge", "Button", "Time"],
  notes: {
    modern:
      "Replies are articles nested inside the article they answer, in a ul named for what it holds; the nesting is the thread’s structure, not a data attribute. The rule down the replies is a border, so forced colours keep it as CanvasText where a background paint would vanish, and one grid rule styles the parent and every reply alike.",
    accessible:
      "Every article is named by its author, the replies list announces its count and whose replies they are, and every Reply button says who it replies to.",
  },
  composition:
    "Each comment is the Comment example's markup, parent and reply alike; the author's reply carries a Badge in its byline the way any Badge is dropped into a row.",
  tags: ["discussion", "replies", "nested", "conversation"],
  order: 6,
};
