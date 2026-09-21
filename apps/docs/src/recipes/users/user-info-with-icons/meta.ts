import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "User info with icons",
  description:
    "One person at a glance: their picture beside their role and name, and beneath them an email and a phone number, each a real link with an icon before it.",
  category: "users",
  uses: ["Avatar"],
  notes: {
    modern:
      "The email is a mailto: link and the phone a tel: link, so a tap opens the mail app or the dialler, and the two are a description list whose terms, Email and Phone, are read but not seen. The role is written after the name, so a heading comes first, and moved above it by order in the grid; a long address wraps anywhere inside a cell floored at zero rather than widening the column.",
    accessible:
      "The Avatar is hidden because the name is printed beside it, each icon is aria-hidden and the term before it says what the row is, so a screen reader hears Email, then the address, and the links keep the page's link colour so they are known as links.",
  },
  composition:
    "Avatar is the one component, sized through its public --loam-avatar-size set on the row; the rest is a heading, a paragraph and a description list.",
  tags: ["profile", "contact", "email", "phone", "avatar"],
  order: 4,
};
