import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Testimonial carousel",
  description:
    "Three quotations in Cards riding a Carousel, with Previous and Next, dots and a heading that names the region.",
  category: "page-sections",
  uses: ["Avatar", "Card", "Carousel"],
  notes: {
    modern:
      "The track is a native scroller with snap points, so a wheel, a swipe and the arrow keys all work before any script; each quote is a figure with a blockquote and a figcaption. The item width is the Carousel’s public --loam-carousel-item-size, set on the region, and the caption sits at the foot with an auto margin so a row of stretched Cards lines up.",
    accessible:
      "The region is named by the visible heading through aria-labelledby, and Previous and Next carry their names as visually hidden text beside the chevrons rather than as a label prop.",
  },
  composition:
    "Carousel, Card and Avatar are assembled from their parts; the example writes the heading and the control row and reaches the figure's insides from a second scope rooted at the Card.",
  tags: ["quotes", "reviews", "slider", "social proof"],
  order: 10,
};
