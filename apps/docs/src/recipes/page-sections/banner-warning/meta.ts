import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Banner warning",
  description:
    "The announcement bar as a warning: a glyph, a message that says its status in hidden words, and a link.",
  category: "page-sections",
  uses: [],
  notes: {
    modern:
      "Still a div with no role: a warning in the page from the start is content the reader meets in order, and only news injected later would announce itself. The glyph is an inline svg sized in em on the message’s type, so it rides the fluid scale with the words beside it. The bar declares --loam-context: warning so a Button or Badge dropped into it answers; its own surface takes the warning tokens directly, since the remap serves the library’s components rather than an element of the page’s own.",
    accessible:
      "The svg is aria-hidden and a visually hidden Warning: opens the sentence, so a screen reader hears the status the glyph shows; the strong glyph on the soft tint is the pair the contrast audit checks.",
  },
  tags: ["announcement", "notice", "status", "warning"],
  order: 6,
};
