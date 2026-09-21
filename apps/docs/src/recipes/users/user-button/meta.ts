import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "User button",
  description:
    "The current account as one control: an avatar, the person's name and their email in a row, the affordance at the foot of a sidebar for switching or opening the account.",
  category: "users",
  uses: ["Avatar", "Button"],
  notes: {
    modern:
      "A real button, because it acts; its accessible name is its visible text, the name and the email, so nothing is written twice. The Button stretches to a one-cell grid rather than being given a width; the email clips with an ellipsis inside a grid cell floored at zero, so a long address never widens the row, and the chevron mirrors under :dir(rtl) because its path is drawn for the inline end.",
    accessible:
      "The Avatar is hidden so the name is heard once, and the Button brings its own focus ring, pressed state and forced-colours edge, so the account control is reached and seen the way every other button is.",
  },
  composition:
    "Avatar and Button are core's and keep their own dressing; the Button detects the chevron and lays its children out as a row, and the example styles only the text and the chevron it puts inside it.",
  tags: ["account", "avatar", "sidebar", "switch account", "profile"],
  order: 2,
};
