import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Footer with social links",
  description:
    "A site footer in two rows: the brand and a line about the co-op at the start with its social profiles as icons at the end, then the small print and the legal links beneath a lighter line.",
  category: "navigation",
  uses: [],
  notes: {
    modern:
      'A footer landmark holding two nav landmarks, Social and Legal, so a landmark list names each; every social link carries rel="me", the identity relation that says the profile is the site’s own. Two flex rows that put their ends apart where there is room and wrap where there is not, decided by the footer’s own width, and the icons are sized in em so they follow the footer’s small type.',
    accessible:
      "Each icon link is named by real text hidden by VisuallyHidden, not an aria-label, with the svg aria-hidden so the name is heard once, and every target is floored at 24px with a gap between neighbours.",
  },
  composition:
    "Element styles alone: anchors, lists, an svg each and core's VisuallyHidden are the whole recipe, so nothing else is imported.",
  tags: ["site footer", "social", "icons", "legal", "copyright"],
  order: 19,
};
