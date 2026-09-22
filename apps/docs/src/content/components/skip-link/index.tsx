import { SkipLink } from "@loamui/core";
import type { ComponentContent } from "@/renderer/types";

const doc: ComponentContent = {
  slug: "skip-link",
  lead: "The first focusable element on the page: a link straight to the main content, visible only while focused.",
  importLine: `import { SkipLink } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "Click into the preview and press Tab: the link appears fixed at the top corner of the viewport, and following it moves focus to the target. This site's own skip link is this component, pointing at its <main>; the demo points at a section of its own so the two do not collide.",
      code: `<SkipLink href="#demo-content" />
<p>Press Tab here to reveal the skip link.</p>
<section id="demo-content" tabIndex={-1}>
  Focus lands here after following the link.
</section>`,
      render: () => (
        <div style={{ display: "grid", gap: "var(--loam-space-xs)", inlineSize: "100%" }}>
          <SkipLink href="#demo-content" />
          <p>Press Tab here to reveal the skip link.</p>
          <section id="demo-content" tabIndex={-1}>
            Focus lands here after following the link.
          </section>
        </div>
      ),
    },
  ],
  whenToUse: [
    "On every page with repeated header content (navigation, search, branding), before the main content.",
    "As the very first element inside <body>, so it is the first Tab stop on the page.",
  ],
  whenNotToUse: [
    "Pages with no header to skip: if the first Tab stop is already the main content, the link only adds a step.",
    "For general in-page navigation: use ordinary anchor links. SkipLink bypasses repeated navigation to reach the main content. Use ordinary links for tables of contents.",
  ],
  howItWorks: [
    {
      title: "Hidden is the unfocused state",
      body: "The link is clipped to a pixel until it receives focus, then appears fixed at the top corner, above every overlay, because a skip link that opens beneath a toast is invisible to the person who needs it most. It reveals on :focus rather than :focus-visible: assistive technology can focus it without triggering keyboard heuristics, and it must appear for every focus.",
    },
    {
      title: "The target is a landmark",
      body: "Point href at the id of the <main> element and give the target tabIndex={-1}: an id alone scrolls, but only a focusable target reliably moves keyboard focus past the header in every browser. <main> keeps the destination meaningful to assistive technology, and the elements layer gives every [id] scroll-margin so the target never hides under sticky chrome.",
    },
  ],
  accessibility: [
    "Keyboard and screen-reader users otherwise re-traverse the whole header on every page; this is the standard escape hatch, and it must be the first Tab stop to do its job.",
    "Reveals on :focus (not :focus-visible), so it appears however focus arrives.",
    "Fixed positioning means appearing never shifts the page layout.",
    "The default label 'Skip to main content' names the destination; if you override it, keep the destination in the words.",
  ],
  props: [
    {
      name: "href",
      type: "string",
      description: 'The id of the main content landmark, e.g. "#content".',
    },
    {
      name: "children",
      type: "ReactNode",
      default: '"Skip to main content"',
      description: "The link label.",
    },
    {
      name: "...others",
      type: "AnchorHTMLAttributes<HTMLAnchorElement>",
      description: "All native <a> props are forwarded.",
    },
  ],
};

export default doc;
