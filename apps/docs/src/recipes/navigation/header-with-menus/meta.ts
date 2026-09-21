import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Header with dropdowns",
  description:
    "A site header whose primary row mixes plain links with two dropdowns, Learn and Support, that open lists of pages; a sign-in link and a signpost to join sit at the end.",
  category: "navigation",
  uses: ["Nav", "SignpostLink"],
  notes: {
    modern:
      "Every page in the two dropdowns is an anchor with an href in a list, and each panel is a native popover, so the top layer, light dismiss and Escape are the browser’s; going somewhere is a link or a SignpostLink, never a Button. One flex row reflows by the header’s own width, the nav dropping to a row of its own where the header is narrow; each panel tethers to its trigger by anchor positioning where the browser has it, and the marker’s edge is set on the Root as a style query the links answer.",
    accessible:
      "A dropdown of pages is a disclosure, not a menu: the trigger is a button reporting aria-expanded and aria-controls, and the panel holds plain links Tab walks like any others, with no menu roles or arrow-key model to learn; it opens on click and never on hover, so a keyboard and a touch screen open the same thing, and the current page carries aria-current on its link.",
  },
  composition:
    "The dropdowns are Nav's own disclosure: a Dropdown in an Item holds a DropdownTrigger, set like the links beside it, and a DropdownPanel holding a List of Links, so the example writes the row on the List and nothing else; there is no Menu here, and nothing is reached into.",
  tags: ["site header", "dropdown", "disclosure", "navbar", "primary nav"],
  order: 15,
};
