import type { RecipeCategory } from "./types";

/**
 * The recipe categories, in display order. Each is a folder under
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
];

export function getCategory(slug: string): RecipeCategory | undefined {
  return RECIPE_CATEGORIES.find((c) => c.slug === slug);
}
