import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Person grid",
  description:
    "Four people under a section header, each an avatar, a name and a role in a centred column.",
  category: "page-sections",
  uses: ["Avatar"],
  notes: {
    modern:
      "A section named by its h2, a header for the intro and a list of four items whose names are h3 headings, so the outline lists the people. An auto-fit grid answers the section’s own width, and the Avatar is sized through its public --loam-avatar-size on the list item rather than a rule inside it.",
    accessible:
      "Each Avatar is aria-hidden because the name is printed beneath it, so a screen reader hears each person once, and the ul carries role=list in the markup because the markers are gone.",
  },
  composition:
    "Avatar is dropped in first in each item, taking its initials from the name; the example writes the column around it and stops at its root.",
  tags: ["team", "people", "about", "growers", "staff"],
  order: 20,
};
