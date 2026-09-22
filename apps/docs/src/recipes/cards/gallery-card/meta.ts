import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Gallery card",
  description:
    "A stay in a Card: a Carousel of three photos with its controls beneath, the name and a Rating with the review count, a description and the Price per night.",
  whenToUse:
    "Use for one listing whose photographs need browsing alongside its rating and price. Choose Article carousel to browse several separate items.",
  category: "cards",
  uses: ["Card", "Carousel", "Price", "Rating"],
  integration:
    "Replace the sample listing destination, photographs, rating, review count and nightly price with real data. The photographs illustrate a fictional stay; keep each alt faithful to the replacement image. Set the heading level for the surrounding page.",
  notes: {
    modern:
      "A native scroll-snap list contains the photographs, so touch and trackpad scrolling work without the paging script, and Carousel supplies the buttons, indicator state and keyboard paging after hydration; the rating has an accessible numeric value and Price renders a data element. Layered scopes protect the embedded controls: the Card measures its content, the public --loam-carousel-item-size hook makes each photograph fill the track, responsive images reserve their ratio, and the controls and rating metadata wrap when space is limited.",
    accessible:
      "The article and photo region are named. Each photograph describes the actual view; controls have photo-specific labels and the visible review count says “63 reviews”. The title is a link to the full listing, without making the entire card an interactive wrapper.",
  },
  composition:
    "A Carousel sits inside a Card the way any content would, its own region inside the article; Rating and Price are dropped in as they come, and the example reaches into none of them.",
  tags: ["carousel", "booking", "stay", "gallery", "photos", "rating"],
  order: 3,
};
