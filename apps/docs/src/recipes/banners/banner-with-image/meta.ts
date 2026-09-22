import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Banner with image",
  description:
    "A fruit-plant offer with a photograph beside the deadline, heading and one clear destination.",
  whenToUse:
    "Use for one offer or announcement when the photograph deserves its own space beside the copy. Choose the background-image banner when the image is decorative.",
  integration:
    'Replace the sample offer, closing date, photograph and destination with your own; use the heading level appropriate to the surrounding page. Keep Badge labels short and put longer details in the adjacent wrapping text. Both banners demonstrate a promotion below the initial viewport: loading="lazy" and sizes="auto, 100vw" let the browser choose a rendition from the rendered image width, with a conservative viewport fallback. For a banner visible on first load, remove lazy loading and auto from sizes; set a layout-appropriate size hint and use high fetch priority only if this is the page’s critical image. Supply appropriately cropped renditions through your own image pipeline. useId only connects each section to its heading; this synchronous component needs no client directive.',
  category: "banners",
  uses: ["Badge", "SignpostLink"],
  notes: {
    modern:
      "A section named by its h2, with the photograph as an img carrying real alt text, because a picture of the fruit on offer is content rather than decoration. Its stylesheet lives in loamui.components inside a donut scope and measures the section’s own inner grid against the header’s fluid token spacing and type: one column with the picture on top, then a 2:3 split at 44rem of its own width, where the picture grows to the height of the words and is cropped rather than letterboxed. The eyebrow declares --loam-context: primary, so the offer Badge inherits the brand context without a styling prop; a promotion does not imply a warning, and the adjacent text spells out the closing date.",
    accessible:
      "useId names each repeated region by its own h2. The photograph has descriptive alt text and reserved space before loading. Enlarged text can grow the layout; rounded image corners do not clip focus rings. The date is written out, the destination is a native link, and the border survives forced colours.",
  },
  composition:
    "No Card: a Card pads every side and the picture runs to the edge, so the section paints its own surface and line from the same tokens; Badge and SignpostLink are dropped in as they come.",
  tags: ["promotion", "offer", "sale", "banner", "photo"],
  order: 1,
};
