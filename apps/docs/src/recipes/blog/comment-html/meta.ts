import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Comment with formatted text",
  description:
    "One comment whose body holds formatted content: a link, bold text and a short list, styled by the element styles alone.",
  category: "blog",
  uses: ["Avatar", "Time"],
  notes: {
    modern:
      "The body is ordinary HTML, a paragraph with a link and a strong, then a ul, so the element styles dress it and a reader’s tools see a link and a list, not a run of styled spans. The example writes no rule for the link, the bold text or the bullets: the element layer already has them, and this scope only spaces the blocks inside the reading measure.",
    accessible:
      "The article is named by its author; the link's text says where it goes and the emphasis is a strong element, so both are announced as what they are.",
  },
  composition:
    "Time writes the distance against a moment the page passes in, never the clock, so a render on the server and the render that hydrates it write the same words.",
  tags: ["discussion", "reply", "thread", "rich text", "formatted"],
  order: 11,
};
