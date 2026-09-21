import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Side nav",
  description:
    "Vertical navigation for an application: a titled list of links with an icon before each and the current page marked.",
  category: "navigation",
  uses: ["Nav"],
  notes: {
    modern:
      "A nav landmark named by its own Title, Nursery, so the words are written once; the links are real anchors and the icons inline svgs before their text.",
    accessible:
      "The current page carries aria-current and is marked by a line and weight as well as a background, so it survives forced colours; each icon is aria-hidden so a link is named by its words alone.",
  },
  composition:
    "Nav's parts are arranged in the markup and nothing else is written: the column around it sets a width and the example's stylesheet is a single rule.",
  tags: ["sidebar", "app shell", "vertical nav", "icons"],
  order: 5,
};
