import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Embed video",
  description:
    "A hosted video in a sized frame: named for assistive technology, lazy until it is near, with a caption and a link to the source.",
  category: "page-sections",
  uses: [],
  notes: {
    modern:
      "A figure holding an iframe and a figcaption; the iframe’s title is the only name a screen reader has for the frame, so it says what the video is and whose it is. The frame is sized by aspect-ratio before anything loads, so the page never shifts, and the subtle background is its footprint until then.",
    accessible:
      "The frame loads lazily and sends a strict-origin referrer; the caption links to the video where it lives, so a reader who cannot use the frame still has a way to it.",
  },
  composition:
    "Element styles alone: what the frame shows is decided by its src, so a video needs no component.",
  tags: ["iframe", "youtube", "media", "video"],
  order: 14,
};
