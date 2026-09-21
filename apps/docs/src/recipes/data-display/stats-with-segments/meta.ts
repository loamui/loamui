import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Share by segment",
  description:
    "Device share as a Table: a row per device with its visits, its percentage and a Meter of that share, and the total in the foot, rather than one stacked bar that only colour could read.",
  category: "data-display",
  uses: ["Meter", "Table"],
  notes: {
    modern:
      "A real table with a caption, column and row headers and a tfoot for the total; each share is a native meter, so the browser reports the value and the CSS only paints it. The percentage sits at a fixed width in tabular figures so every bar starts on the same line and takes the rest of its cell, and the figures are end-aligned to stack on their last digit.",
    accessible:
      "A stacked bar reads only by colour; a row per device says each share in text and as a named meter, and forced colours keep every bar because the Meter paints itself in system colours.",
  },
  composition:
    "Table and Meter are dropped in as they come: the Table rules the rows and the header, the Meter its track and fill, and the example only lays the bar beside its figure.",
  tags: ["share", "segments", "breakdown", "devices", "analytics", "meter"],
  order: 14,
};
