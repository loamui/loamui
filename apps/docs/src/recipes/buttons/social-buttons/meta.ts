import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Social buttons",
  description:
    "Three sign-in buttons, one per provider, each with the provider's mark and its name in the words, in a row where there is room and a stack where there is not.",
  category: "buttons",
  uses: ["Button"],
  notes: {
    modern:
      "Each button submits its own form to the provider’s sign-in address with POST, because starting a sign-in is an action with a side effect, not a page to link to; the form works with JavaScript off. The list answers a container query on the wrapper, three columns from 36rem and one below, and each form is a one-cell grid so its Button stretches to the cell without a width prop.",
    accessible:
      "Every button says the provider's name in its words (Continue with GitHub), so the marks are decoration and aria-hidden, and the names are told apart by a screen reader and a password manager alike. The list keeps its role, so the count of ways to sign in is announced.",
  },
  composition:
    "Core Buttons with the marks as svg children, which the Button detects and sizes; nothing is passed for the icon or the layout. Two marks are cut in currentColor and follow the button's text; Google's keeps the four colours its guidelines require.",
  tags: ["sign in", "oauth", "google", "github", "apple", "social", "login"],
  order: 4,
};
