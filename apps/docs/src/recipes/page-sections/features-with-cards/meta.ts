import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Features with cards",
  description:
    "A centred intro, then six features on cards in a grid that fits as many across as it has room for: an icon, a heading and a line each.",
  category: "page-sections",
  uses: ["Card"],
  notes: {
    modern:
      "A section named by its h2, a header for the intro and a list of six cards with h3 headings, so the outline reads the way the page looks. The list is an auto-fit grid answering the section’s own width, and each card is scoped from its own root so the section’s rule never reaches inside a Card. The icon square is the soft primary tint with the strong token for the glyph, so a --loam-context region around the section re-colours every icon at once.",
    accessible:
      "The icons are aria-hidden because the headings carry the meaning, the list keeps role=list so the count survives list-style: none, and the tint gets a border in forced colours.",
  },
  composition:
    "Card is rendered as the list item through its render prop, so the surface and the semantics are one element and the example never touches the Card's own padding or line.",
  tags: ["features", "services", "cards", "grid", "icons"],
  order: 24,
};
