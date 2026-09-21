import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Users grid",
  description:
    "The growers as a grid of cards: each with a picture, a name and role, an email, an hourly rate, and a signpost to book a session with them.",
  category: "users",
  uses: ["Avatar", "Card", "Price", "SignpostLink"],
  notes: {
    modern:
      "A list of articles, each named by its heading, so a screen reader announces four items and can jump between them; the email is a mailto: link and the rate a data element whose machine-readable value is the number. The list is a grid of as many 16rem columns as fit, so the cards reflow with no breakpoint, and each card is a two-column grid inside with the facts and the action spanning both.",
    accessible:
      'The Avatar is hidden because the name is printed beside it, the list keeps its semantics with role="list" once the markers go, and booking is a link because it goes to a page, with the arrow that says so drawn by SignpostLink.',
  },
  composition:
    "Card is rendered as the article through render, so the surface and the semantics are one element; Avatar, Price and SignpostLink come as they are, and the qualifier, an hour, is the Price's own child.",
  tags: ["team", "cards", "grid", "growers", "rate", "directory"],
  order: 7,
};
