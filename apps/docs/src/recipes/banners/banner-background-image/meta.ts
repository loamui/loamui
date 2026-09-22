import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Banner with background image",
  description:
    "The same fruit-plant offer as Banner with image, with its deadline, heading, description and link over a full-width raspberry photograph.",
  whenToUse:
    "Use for one short promotion within a page, with a decorative image filling the section. Choose a hero when the content introduces the whole page.",
  integration:
    'Replace the sample offer, closing date, photograph and destination with your own; use the heading level appropriate to the surrounding page. Keep Badge labels short and put longer details in the adjacent wrapping text. Both banners demonstrate a promotion below the initial viewport: loading="lazy" and sizes="auto, 100vw" let the browser choose a rendition from the rendered image width, with a conservative viewport fallback. For a banner visible on first load, remove lazy loading and auto from sizes; set a layout-appropriate size hint and use high fetch priority only if this is the page’s critical image. Supply appropriately cropped renditions through your own image pipeline. useId only connects each section to its heading; this synchronous component needs no client directive.',
  category: "banners",
  uses: ["Badge", "SignpostLink"],
  notes: {
    modern:
      "A section named by its h2 promotes one destination, and the decorative photograph is an img with empty alt, explicit dimensions and lazy loading for a promotion below the fold. Its stylesheet lives in loamui.components inside a donut scope, measuring the header’s fluid token spacing and type through container queries rather than the viewport: the text takes the leading column of a 3:2 grid from 44rem and fills one column below that, with the photograph covering the whole section. Contextualism carries the rest — the surrounding colour scheme resolves the background, scrim, text and link tokens together, and the eyebrow declares the primary brand context so the offer Badge inherits it without a prop, because a promotion does not imply a warning.",
    accessible:
      "useId names repeated regions independently. A solid background, full foreground text and an 88% scheme-aware background-token scrim protect the words even if the photograph fails; recheck contrast when changing either. Content determines the height and grows with enlarged text. Focus rings are not clipped. Forced colours remove the decorative image and scrim, leaving system colours and a visible border.",
  },
  composition:
    "The section owns the photograph and scrim instead of overriding a Card surface; Badge and SignpostLink are composed unchanged, beyond the scope boundary.",
  tags: ["promotion", "background", "image", "full-width", "call to action"],
  order: 2,
};
