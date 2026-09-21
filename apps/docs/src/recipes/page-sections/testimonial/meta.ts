import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Testimonial",
  description:
    "One quotation in a Card: the words, then who said it with an avatar, a name and a role.",
  category: "page-sections",
  uses: ["Avatar", "Card"],
  notes: {
    modern:
      "A figure whose quote is a blockquote and whose author is the figcaption, so the platform ties the attribution to the words rather than a layout implying it. The blockquote drops the element style’s rule and muted colour because here it is the main text, not an aside; everything else is the figure’s gap.",
    accessible:
      "The Avatar is aria-hidden with the name for its initials, because the name is printed beside it and a screen reader should hear each person once.",
  },
  composition:
    "Card is the surface, rendered as the figure through its render prop; the example arranges the quote and caption inside and never touches the Card's own border, radius or padding.",
  tags: ["quote", "review", "social proof"],
  order: 9,
};
