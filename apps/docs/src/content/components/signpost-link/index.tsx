import { SignpostLink } from "@loamui/core";
import type { CSSProperties } from "react";
import type { ComponentContent } from "@/renderer/types";

const doc: ComponentContent = {
  slug: "signpost-link",
  lead: "A prominent navigational link: the signpost to a task's starting point.",
  importLine: `import { SignpostLink } from "@loamui/core";`,
  contextual: true,
  demos: [
    {
      title: "Basic usage",
      description:
        "A real <a> with a circled arrow. Use it where a page hands over to a task: the start of an application, a checkout, a service.",
      code: `<SignpostLink href="#apply">Start your application</SignpostLink>`,
      render: () => <SignpostLink href="#apply">Start your application</SignpostLink>,
    },
    {
      title: "Contexts",
      description:
        "The arrow's circle is a solid status fill, so a context region recolours it like any other component.",
      code: `<div style={{ "--loam-context": "danger" }}>
  <SignpostLink href="#appeal">Appeal this decision</SignpostLink>
</div>`,
      render: () => (
        <div style={{ "--loam-context": "danger" } as CSSProperties}>
          <SignpostLink href="#appeal">Appeal this decision</SignpostLink>
        </div>
      ),
    },
    {
      title: "Router link",
      description:
        "Substitute the element with render to keep client-side navigation. The label stays on SignpostLink and the arrow anatomy becomes the element's children; an element that brings children of its own keeps them, as the merge contract says, and so skips the arrow. The visual is identical to Basic; the point is the swapped element (a framework router link), visible in the Code tab.",
      code: `<SignpostLink render={<Link href="/apply" />}>Start your application</SignpostLink>`,
      render: () => (
        <SignpostLink render={<a href="#apply" />}>Start your application</SignpostLink>
      ),
    },
  ],
  whenToUse: [
    "To signpost the way into a task from a content page: 'Start your application', 'Book an appointment', 'Go to checkout'.",
    "Where a design asks for a button-sized call-to-action that navigates: this keeps real link semantics with button-scale prominence.",
    "One per destination: a signpost stands out because the links around it are plain.",
  ],
  whenNotToUse: [
    "For actions: anything that submits, mutates or confirms is a Button. A signpost only ever goes somewhere.",
    "For links inside prose or navigation lists: ordinary links carry those; a page of signposts signposts nothing.",
    "Side by side with a Button of equal weight: two competing calls-to-action split the click. Decide which one the page is for.",
  ],
  howItWorks: [
    {
      title: "Going, not doing",
      body: "The element must match the behaviour: navigation is an <a>, actions are a <button>. A signpost is the navigational counterpart to Button: link semantics (right-click, middle-click, open-in-new-tab, link announcement) with enough visual weight to carry a call-to-action. If the destination mutates state when it loads, it was an action all along; use a Button and a handler.",
    },
    {
      title: "The arrow is decoration",
      body: "The circled arrow is aria-hidden: assistive technology hears only the label and the link role. The signpost inherits its font size from where it sits, and the arrow rides it in em, so the whole thing rescales as one piece in a heading, a card or a paragraph. No size prop.",
    },
  ],
  accessibility: [
    "Renders a real <a>, so focus, Enter activation and the link role come from the platform.",
    "The arrow glyph is aria-hidden decoration; the accessible name is exactly the label text.",
    "The label underlines on hover with the primary decoration colour, matching the page-wide link affordance.",
    "The circle/arrow pairing uses the audited solid-fill tokens, so it holds contrast in every scheme and context.",
  ],
  props: [
    {
      name: "render",
      type: "element | (props) => node",
      description:
        "Substitute the built-in <a>, e.g. a router link: render={<Link href=… />}. The label stays as SignpostLink's children.",
    },
    {
      name: "...others",
      type: "AnchorHTMLAttributes<HTMLAnchorElement>",
      description: "All native <a> props are forwarded (href, target, …).",
    },
  ],
};

export default doc;
