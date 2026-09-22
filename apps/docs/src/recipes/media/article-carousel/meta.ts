import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Article carousel",
  description:
    "Five journal articles as Cards on a Carousel track: a photo, a category Badge, a title and a Read article link each, with Previous and Next beside the title and a dot per article beneath.",
  whenToUse:
    "Use when readers need to browse several articles in a horizontal collection. Choose a grid when seeing and comparing the items together is more useful.",
  category: "media",
  uses: ["Badge", "Card", "Carousel", "SignpostLink", "VisuallyHidden"],
  integration:
    "Replace the sample articles and destinations with real content. Choose a visible grid when comparison or discovery of every item matters more than a compact horizontal collection. Adjust heading levels to the page; keep the accessible link suffixes unique.",
  notes: {
    modern:
      "The track is an ordinary scroll-snap list that supports touch and trackpad scrolling without the paging script, with Carousel supplying keyboard paging and button state after hydration, and each Card an article named by its heading. The public item-size property sets the preferred card width while the track caps it to the available space; each Card measures its own content, uses layered scoped rules and aligns the final link with an auto margin, and responsive images are lazy and reserve their ratio.",
    accessible:
      "The region is named by its heading, the paging Buttons and the dots are named through labels, the status announces Article 2 of 5 once the track settles, and every Read article link finishes with the article's title in hidden text.",
  },
  composition:
    "Carousel.Root, Track, Item, Previous, Next and Indicators are arranged in the markup: the Buttons sit beside the title and the dots beneath, an arrangement the parts allow because they read one context rather than one layout.",
  tags: ["carousel", "articles", "cards", "slider", "journal"],
  order: 1,
};
