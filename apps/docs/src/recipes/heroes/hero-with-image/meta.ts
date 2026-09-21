import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Hero with image",
  description:
    "A page-opening section: an eyebrow, a headline, a lede and two actions beside a photograph.",
  whenToUse:
    "Use to introduce a page when the photograph conveys information alongside the headline. Choose the background-image hero when the photograph sets the atmosphere behind the message.",
  integration:
    'Use the h1 for the page\'s main heading; choose the appropriate heading level if adapting this into a subsection. Replace the sample photograph, alt text and routes. Keep the badge label brief and put longer seasonal information in the wrapping text beside it. Its dimensions reserve space and fetchPriority="high" suits an above-the-fold hero image: avoid lazy-loading the page\'s likely largest-contentful-paint image. The sample srcSet offers three renditions; sizes="100vw" is a conservative upper bound because this portable recipe cannot know its host width. Replace it with an accurate sizes hint for your page and use your own image pipeline. Reserve high priority for the page\'s critical image. This synchronous component can render on the server; useId does not require a client directive.',
  category: "heroes",
  uses: ["Badge", "SignpostLink"],
  notes: {
    modern:
      "A section named by its h1, with a native header and image; element styles supply the heading typography, body leading and link states, and the recipe adds only its layout and editorial roles. An intrinsic auto-fit grid makes two columns when both fit and stacks them otherwise, measuring the contents’ fluid type and spacing, with styles in loamui.components inside a donut scope so element defaults remain the base and selectors stop at LoamUI component boundaries. The eyebrow declares --loam-context: primary, so the Badge inside takes the brand colour without a prop — primary is the brand slot, neutral until a theme fills it, and the eyebrow reads as one by its place above the heading.",
    accessible:
      "useId keeps each region tied to its own heading. Both destinations are keyboard-operable links with visible text, the play icon is decorative, and the photograph has descriptive alt text. Content order is unchanged when the grid stacks.",
  },
  composition:
    "Badge identifies the catalogue, SignpostLink goes to the catalogue and an ordinary link opens the seed-saving film.",
  tags: ["landing", "marketing", "banner"],
  order: 1,
};
