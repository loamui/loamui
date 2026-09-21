import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Simple FAQ",
  description:
    "Four questions under a heading, each a native disclosure sharing one name so only one answer is open at a time.",
  category: "faq",
  uses: ["Details"],
  notes: {
    modern:
      "Each question is a details element with the question as its summary: the browser owns the toggle, the keyboard support and, through the shared name, the rule that opening one closes the rest, with no state in the page. The example is a grid of gaps and nothing more; the surface, line, chevron and open state are the Details’ own, and its open animation is gated on interpolate-size by core, not here.",
    accessible:
      "Four short questions is where an exclusive set fits: a long FAQ is better as headings with a table of contents, as the Details guide says, because an answer that is closed is an answer that may never be read.",
  },
  composition:
    "Details.Root, Summary and Content as core ships them, four times over with one name; the example's rule stops at each root.",
  tags: ["faq", "accordion", "questions", "disclosure", "help"],
  order: 1,
};
