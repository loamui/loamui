import type { RecipeCategory } from "./types";

/**
 * The example categories, in display order. Each is a folder under
 * src/recipes; the generator refuses a folder that is not listed here,
 * and the gate refuses an entry with no folder. JSX-free, so the export
 * script and the navigation can import it.
 */
export const RECIPE_CATEGORIES: RecipeCategory[] = [
  {
    slug: "heroes",
    title: "Heroes",
    blurb: "Page introductions with a headline, supporting copy and clear destinations.",
  },
  {
    slug: "banners",
    title: "Banners",
    blurb: "Focused promotions with one destination, beside or over a photograph.",
  },
  {
    slug: "cards",
    title: "Cards",
    blurb: "One article, person or listing presented as a self-contained item.",
  },
  {
    slug: "media",
    title: "Media",
    blurb: "Browse a collection of articles or compare two images.",
  },
  {
    slug: "grids",
    title: "Grids",
    blurb: "Arrange a featured item or align content across a set of cards.",
  },
  {
    slug: "content",
    title: "Content",
    blurb: "Present questions and answers or a sequence of dated events.",
  },
  {
    slug: "forms",
    title: "Forms",
    blurb: "Sign in, recover from errors or send an enquiry with clear labels and next steps.",
  },
  // Unpublished source folders remain registered for validation.
  {
    slug: "page-sections",
    title: "Page sections",
    blurb: "Heroes, features and calls to action: the blocks a marketing page is built from.",
  },
  {
    slug: "navigation",
    title: "Navigation",
    blurb: "Headers, footers and side navigation: the way around a site.",
  },
  {
    slug: "data-display",
    title: "Data display",
    blurb: "Stats, lists and summaries: figures and facts laid out to be read at a glance.",
  },
  {
    slug: "app-cards",
    title: "Application cards",
    blurb: "A product surface composed from an image, features, a price and a destination.",
  },
  {
    slug: "users",
    title: "Users",
    blurb: "A member profile with labelled statistics and a follow interaction.",
  },
  {
    slug: "blog",
    title: "Blog",
    blurb: "Article teasers with bylines, images and clear reading destinations.",
  },
  {
    slug: "commerce",
    title: "Commerce",
    blurb: "Products, prices, baskets and plans: the parts of a shop.",
  },
  {
    slug: "buttons",
    title: "Buttons",
    blurb: "Buttons that do one more thing: copy, open a menu, show progress, sign in.",
  },
  {
    slug: "sliders",
    title: "Sliders",
    blurb: "A value from a range: marks, a live readout, and a number box beside it.",
  },
  {
    slug: "faq",
    title: "FAQ",
    blurb: "Questions and answers as native disclosures, alone or with a header and an image.",
  },
  {
    slug: "errors",
    title: "Error pages",
    blurb: "What a visitor sees when something is missing or broken, with a way out.",
  },
];

export function getCategory(slug: string): RecipeCategory | undefined {
  return RECIPE_CATEGORIES.find((c) => c.slug === slug);
}
