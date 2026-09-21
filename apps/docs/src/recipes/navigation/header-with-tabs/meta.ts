import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Header with tabs",
  description:
    "An application header in two rows: the brand and the signed-in person's menu across the top, and beneath them the sections as a row of tabs with the current one underlined.",
  category: "navigation",
  uses: ["Avatar", "Menu", "Nav"],
  notes: {
    modern:
      'The tabs are links in a nav, not a tablist: each goes to a page, so it is an anchor with an href and the current one carries aria-current; Sign out is a submit button in a method="post" form. The underline is Nav’s own marker moved from the link’s start edge to its block end by one declaration, the public --loam-nav-current-edge on the header, which the Nav answers through a style query, and the row sits on the header’s line by a one-pixel overlap.',
    accessible:
      "The account Button is named Account menu for Imogen Hartley by hidden words before the visible name, with the Avatar hidden so the name is heard once, and it brings its own focus ring and forced-colours edge; the current tab is a line and weight, not colour alone, and Nav names the line in the system highlight under forced colours.",
  },
  composition:
    "Menu's trigger is the Button core renders, holding an Avatar, the name and a chevron the Button detects and lays out; Nav's List is given a class and a flex row; neither component is restyled, and no rule reaches a link or the Button.",
  tags: ["app header", "tabs", "account menu", "avatar", "top bar"],
  order: 17,
};
