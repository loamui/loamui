import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Card with an actions grid",
  description:
    "A Services card: nine actions as Buttons with an icon and a full name each, in a grid that fits as many across as it has room for, and a link to the rest.",
  category: "app-cards",
  uses: ["Button", "Card"],
  notes: {
    modern:
      "The Card is a section named by its own heading, the actions are a list of buttons, and the way to the rest is a link, because it goes to a page rather than doing something here. The grid is auto-fill over a minimum tile width, so the count of columns is the Card’s width divided by a readable tile, never a breakpoint, and each cell is a grid so its Button stretches to fill it.",
    accessible:
      "Every action is named in full, so a tile reads as Book a delivery rather than an icon and a word; the icons are hidden because the names already say it.",
  },
  composition:
    "Button is dropped in as it comes with its icon as a child, detected rather than passed through a slot; the example arranges the grid around the Buttons and never reaches inside one.",
  tags: ["services", "actions", "shortcuts", "dashboard", "quick links"],
  order: 1,
};
