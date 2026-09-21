import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Copy to clipboard",
  description:
    "A referral link shown in a read-only box with a button beside it that copies the link and says so, and selects the text on focus for anyone who would rather copy it by hand.",
  category: "buttons",
  uses: ["CopyButton", "Field", "Input"],
  notes: {
    modern:
      "The link is in a real read-only input, so it can be focused, selected and copied with the keyboard whether or not the Clipboard API is available; focusing it selects the whole address, one keystroke from a manual copy. The row is a two-track grid; the CopyButton’s wrapper has no box, so the Button takes the second track as a bare Button would, sharing the derived control height with the box beside it.",
    accessible:
      "The button is named for its action, Copy link, and reads Copied for a moment after a successful copy, announced through a status region as well as shown, so the confirmation reaches a screen reader without moving focus. A refused copy is announced too, with what to do instead; the label never claims a copy it did not make.",
  },
  composition:
    "Field.Root, Label and Description name and explain the box; CopyButton is core's Button with the copy and its confirmation built in, given the link and the word to say afterwards.",
  tags: ["copy", "clipboard", "share", "link", "referral", "read-only"],
  order: 1,
};
