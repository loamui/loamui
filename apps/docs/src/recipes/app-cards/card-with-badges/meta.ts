import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Card with badges",
  description:
    "A place in a Card: a photo, its name with a Badge for where and when, a description, the amenities on site as an icon list, and a way to plan a visit.",
  category: "app-cards",
  uses: ["Badge", "Card", "SignpostLink"],
  notes: {
    modern:
      "The Card is an article named by its heading; the badges and the amenities are lists, each named for what it lists, so a reader can jump to On site and hear five items. The amenities are an auto-fill grid over a minimum width, so a narrow Card stacks them and a wide one runs them across, and the icons are sized in em to the text beside them.",
    accessible:
      "The photo has an empty alt because the heading names the place; each amenity is a word beside a hidden icon, so nothing is said by picture alone; the call to action is a link because it goes somewhere.",
  },
  composition:
    "Badge and SignpostLink are dropped in as they come; the example arranges the column between them and never restyles a pill or the arrow.",
  tags: ["place", "venue", "listing", "amenities", "location"],
  order: 2,
};
