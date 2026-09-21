import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Split button",
  description:
    "Add to basket with a chevron beside it that opens the other ways to add: one group with a shared edge, every choice a real submit of the same form.",
  category: "buttons",
  uses: ["Button", "Menu"],
  notes: {
    modern:
      "One form: the main button submits it, and each menu item is a submit button with its own name and value, so the server learns which way was chosen and nothing needs JavaScript to post; the menu is a native popover with light dismiss and Escape. The shared edge is --loam-button-radius, the public hook Button reads, set on the group for the trigger and on the main cell for its button, with :dir(rtl) swapping the two values because border-radius is physical and a one-pixel negative margin laying the two borders on one line. The form declares --loam-context: primary because both buttons belong to the one action; primary is the brand slot, neutral until a theme fills it, and a theme that does recolours the pair as one.",
    accessible:
      "The main button is named for its action and the trigger for its purpose, More ways to add, by hidden words beside the chevron, with aria-haspopup so the menu is expected; the arrows open and move through the items, and choosing one submits. The two are separate tab stops, so a keyboard user can take the main action without opening the menu.",
  },
  composition:
    "Button and Menu.Root, Trigger, Popup and Item as core ships them; the items substitute submit buttons through render, and the primary look comes from the form being a primary region, not from a prop on either button.",
  tags: ["split button", "menu", "basket", "actions", "group", "dropdown"],
  order: 5,
};
