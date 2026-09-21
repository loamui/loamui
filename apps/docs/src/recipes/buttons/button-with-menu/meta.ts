import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Button with menu",
  description:
    "A Create new button that opens a menu of the things a member can add, each with an icon and each a link to the page that makes it.",
  category: "buttons",
  uses: ["Menu"],
  notes: {
    modern:
      "The items are links, because each creates something on its own page; the popup is a native popover in the top layer with light dismiss and Escape, anchored to the button where the browser has anchor positioning. One declaration does the styling: the Menu declares --loam-context: primary because its trigger is the area’s action, so the button’s colour is answered by context and no variant is passed, and the icons are svg children that the Button and the items detect and size on their own text. Primary is the brand slot, neutral until a theme fills it, so the declaration says where the action belongs rather than making it stand out.",
    accessible:
      "The button is named Create new with aria-haspopup, so a screen reader hears that a menu follows; ArrowDown opens it on the first item, the arrows move through, typing a letter jumps to an item, and choosing one closes the menu and follows the link. The icons are aria-hidden: the words name every item.",
  },
  composition:
    "Menu.Root, Trigger, Popup and Item as core ships them, the icons ordinary children detected by the stylesheet; the trigger is the default core Button with a plus before its words and a chevron after.",
  tags: ["menu", "dropdown", "create", "button", "actions", "icons"],
  order: 2,
};
