import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Table of contents",
  description:
    "A list of the page's headings beside its text, with the section in view marked as the reader scrolls.",
  category: "navigation",
  uses: ["Nav", "useScrollSpy"],
  notes: {
    modern:
      "The links are fragment links to the headings’ own ids, so they work before any script runs and the browser’s smooth scroll and scroll margin carry the jump. The page is a container: the list sits above the article where it is narrow and beside it, sticky, where it is wide, decided by the page’s own width rather than the viewport’s.",
    accessible:
      'The section in view carries aria-current="location", not "page", because the reader has not left the page; the nav is named by its own title, On this page.',
  },
  composition:
    "useScrollSpy answers which heading is in view and Nav.Link's current prop says so; the hook observes the headings the example renders itself, one observer for the set.",
  tags: ["toc", "on this page", "scroll spy", "anchors", "sticky"],
  order: 7,
};
