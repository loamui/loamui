import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Header with mega menu",
  description:
    "A site header where Growing opens a wide panel: a grid of six guides with an icon, a title and a line each, and a strip at the foot pointing to the beginners' course.",
  category: "navigation",
  uses: ["Nav", "SignpostLink"],
  notes: {
    modern:
      "The panel is a native popover in the top layer, so light dismiss and Escape are the browser’s, and every guide inside is an anchor in a list; the panel opens on a press, not on hover, so a keyboard and a touch screen open the same thing. The panel’s width is Nav’s public --loam-nav-dropdown-size, raised to 32rem on the Root where the panel reads it, and the guides fill it with auto-fill columns, so two sit side by side where there is room and one where there is not; the strip at the foot is a box with its own padding inside the panel’s.",
    accessible:
      "A panel of pages is a disclosure, not a menu or a dialog: the trigger is a button reporting aria-expanded and aria-controls, and the panel holds plain links Tab walks like any others, with no menu roles to learn; it opens on click and never on hover, and each guide is named by its title and text together, so a screen reader hears what a link leads to before following it.",
  },
  composition:
    "The wide panel is Nav's own disclosure: a Dropdown in an Item holds a DropdownTrigger, set like the links beside it, and a DropdownPanel holding a List of Links; each guide is a Nav.Link with the example's own icon and two lines of words inside, so the grid, the words and the foot are the example's and the lines, the surface, the tether and the dismissal stay Nav's.",
  tags: ["site header", "mega menu", "dropdown", "guides", "navbar"],
  order: 16,
};
