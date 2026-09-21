import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Input with tooltip",
  description:
    "A plot reference box with an information button beside it that opens a tooltip on hover and on keyboard focus, saying where the reference is printed.",
  category: "forms",
  uses: ["Field", "Input", "Tooltip"],
  notes: {
    modern:
      "The trigger is a real button, so it is in the tab order and the tooltip opens on focus as well as hover; the bubble is a popover in the top layer where the browser has anchor positioning, and a wrapper-anchored span elsewhere. A two-column grid holds the box floored at zero and the Button at its own width: both take the derived control height, so the row lines up with no measuring, and the icon is sized in em from the Button’s type.",
    accessible:
      "The tooltip holds a hint, not the requirement: the label names the field and it works without the bubble, since hover is unavailable on touch. The Button is named by hidden text and described by the bubble through aria-describedby, so a screen reader hears the hint on reaching it; Escape dismisses the bubble without moving focus.",
  },
  composition:
    "Field, Input and Tooltip.Root, Trigger, Popup and Arrow as core ships them, the trigger the Button that Tooltip renders; it is named by hidden text beside its icon, which is what makes the Button square, so nothing is redressed by hand.",
  tags: ["tooltip", "help", "hint", "info", "input", "icon button"],
  order: 18,
};
