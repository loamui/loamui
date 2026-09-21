import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "User menu",
  description:
    "The signed-in person's menu: an avatar button that opens their name and email, their account pages, and a sign-out that posts a form.",
  category: "users",
  uses: ["Avatar", "Menu"],
  notes: {
    modern:
      'Sign out is a submit button in a method="post" form, because ending a session changes state on the server and a GET link would be followed by prefetchers and crawlers.',
    accessible:
      "The button is named for the person by hidden text, Account menu for Imogen Hartley, with the Avatar hidden so the name is heard once; arrow keys, typeahead, Escape and focus return are Menu's own.",
  },
  composition:
    "Menu's trigger is the Button core renders, holding an Avatar and hidden text and never restyled, and the account block is plain text before the items with a Menu.Separator under it, so arrow keys skip it and it names the menu instead.",
  tags: ["account", "avatar", "dropdown", "sign out", "profile"],
  order: 1,
};
