import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Embed map",
  description:
    "A map in a squarer frame: named for what it shows, lazy until it is near, with directions in words and a link to the full map.",
  category: "page-sections",
  uses: [],
  notes: {
    modern:
      "The same figure and iframe as the video, with a src that happens to be a map; the title says what the map shows, since that is the only name the frame has. A 4 / 3 aspect-ratio on the frame, because a map reads better squarer than a video; nothing else changes between the two embeds.",
    accessible:
      "The caption gives the directions in words and links to the full map, so a reader who cannot use the frame is not left with a picture of a place.",
  },
  composition:
    "Element styles alone: what the frame shows is decided by its src, so a map needs no component.",
  tags: ["iframe", "openstreetmap", "location", "directions"],
  order: 15,
};
