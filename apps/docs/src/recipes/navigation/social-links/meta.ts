import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Social links",
  description:
    "A row of icon-only links to the co-op's profiles, each named by text that is read but not seen.",
  category: "navigation",
  uses: [],
  notes: {
    modern:
      'A nav landmark named Social around a list of plain links; each link carries rel="me", the identity relation that says the profile is the site’s own. The icon is sized in em, so it follows whatever type surrounds the row, and every target is floored at 24px with a gap between neighbours, whatever size that makes the glyph.',
    accessible:
      "The name is real text hidden by VisuallyHidden, not an aria-label: it translates, it shows in reader mode, and the svg is aria-hidden so the name is heard once.",
  },
  composition:
    "Element styles and one component: an anchor, an inline svg and core's VisuallyHidden are the whole recipe.",
  tags: ["social", "icons", "profiles", "footer"],
  order: 8,
};
