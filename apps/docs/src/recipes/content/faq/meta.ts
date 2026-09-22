import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "FAQ",
  description:
    "Four questions with visible answers on a subtle surface, beneath a heading and a direct contact link.",
  whenToUse:
    "Use for a short set of questions readers need to scan, search and compare. Keep these answers visible; reserve disclosure controls for genuinely optional supporting detail.",
  category: "content",
  uses: [],
  integration:
    "Replace the sample policies with accurate answers for the organisation and connect the contact destination. Keep essential ordering information in the ordering flow too. Give distinct FAQ sections distinct headings, and use the appropriate heading levels.",
  notes: {
    modern:
      "A section named by its heading, with a native list grouping four questions, each a heading followed by its answer; the contact link is an ordinary anchor and every answer is available without client-side interaction. The section measures a readable inner column through layered, scoped rules that use fluid typography and spacing tokens, logical separators, and mutually exclusive container queries for the outer padding. It stays a plain neutral surface rather than a --loam-context region: questions carry no status, so nothing inside should take a status colour.",
    accessible:
      "All answers remain visible for scanning, browser search and comparison. Headings expose the question structure, the contact link offers a next step, and a forced-colour border preserves the section boundary.",
  },
  composition:
    "Tokens and element styles provide the surface, type and links. Native HTML supplies all the anatomy this recipe needs; it does not import a component solely to make the answers collapsible.",
  tags: ["faq", "questions", "surface", "help"],
  order: 2,
};
