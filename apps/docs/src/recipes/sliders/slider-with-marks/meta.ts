import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Slider with marks",
  description:
    "A soil-moisture target on a slider with ticks and labels at 0, 25, 50, 75 and 100 percent, snapping to them where the browser offers it.",
  category: "sliders",
  uses: ["Field", "Range"],
  notes: {
    modern:
      'A native <input type="range"> with a <datalist> of the marks: the platform snaps the thumb to them where it supports it, and the ticks under the track are a picture of that list, hidden from assistive technology so the slider is not followed by a phantom listbox. Nothing but a width sits in its stylesheet: every mark’s position is one custom property core sets on it, placed by the thumb’s own geometry in em, so the labels stay under their values at every container width and text size.',
    accessible:
      "The slider is named by the Field's label and described by its text; the arrow keys move it by the step and Home and End go to the ends, all the platform's. In forced colours the thumb and track are repainted in system colours by core and the tick marks, being borders, keep their line.",
  },
  composition:
    "Field.Root, Label and Description name and explain the control, and Range takes the marks as data: the same five values feed the datalist and the labels, so they cannot disagree.",
  tags: ["slider", "range", "marks", "ticks", "datalist", "moisture"],
  order: 1,
};
