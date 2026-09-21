import type { ComponentContent } from "@/renderer/types";
import { DetailsBasicDemo, DetailsDefaultOpenDemo, DetailsExclusiveDemo } from "./examples";

const doc: ComponentContent = {
  slug: "details",
  lead: "The platform's disclosure widget: a styled native <details>/<summary>, composed from parts.",
  importLine: `import { Details } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "Each Details is independent: a complete native disclosure widget that opens and closes on its own.",
      code: `<Details.Root>
  <Details.Summary>Advanced options</Details.Summary>
  <Details.Content>Extra settings most people never need.</Details.Content>
</Details.Root>`,
      render: () => <DetailsBasicDemo />,
    },
    {
      title: "Default open",
      description: "Use defaultOpen to expand a section on first render.",
      code: `<Details.Root defaultOpen>
  <Details.Summary>Getting started</Details.Summary>
  <Details.Content>Create your workspace and invite your first teammate.</Details.Content>
</Details.Root>`,
      render: () => <DetailsDefaultOpenDemo />,
    },
    {
      title: "Exclusive set",
      description:
        "Give several Details the same name and the browser itself closes the others when one opens: no state, no JS. This is the accordion pattern.",
      code: `<Details.Root name="extras">
  <Details.Summary>Gift options</Details.Summary>
  <Details.Content>Add a gift message or hide prices on the packing slip.</Details.Content>
</Details.Root>
<Details.Root name="extras">
  <Details.Summary>Delivery instructions</Details.Summary>
  <Details.Content>Tell the courier where to leave the parcel.</Details.Content>
</Details.Root>
<Details.Root name="extras">
  <Details.Summary>Order notes</Details.Summary>
  <Details.Content>Anything else we should know about this order.</Details.Content>
</Details.Root>`,
      render: () => <DetailsExclusiveDemo />,
    },
  ],
  whenToUse: [
    "For progressive disclosure of secondary detail ('advanced options' most people never need), while keeping primary actions and required information outside it.",
    "To shorten a genuinely long page by collapsing distinct, secondary sections that most readers skip.",
    "As an exclusive set (shared name) when the sections are alternatives and holding two open at once would only mislead.",
  ],
  whenNotToUse: [
    "When most users need the content: content hidden by default may never be read. Collapsed sections routinely go unopened. Put it on the page under headings.",
    "For a long FAQ: a dozen questions or more, or one people arrive at by link, belongs under headings with a table of contents, because a closed disclosure hides the answer from find-in-page and from a link into the page wherever the browser does not open it automatically. A short set of questions reads well as an exclusive set. A long FAQ is usually a symptom that the page it answers for is unclear.",
    "For small amounts of content: the click cost of opening outweighs the space saved; plain prose is simpler.",
    "Nested inside another Details: stacked disclosure widgets make it unclear what is open, what is hidden, and how much content remains.",
  ],
  howItWorks: [
    {
      title: "Only to shorten a long page",
      body: "Disclosure trades space for discoverability: the page gets shorter, but every collapsed section becomes content most users will never open. That trade only pays for genuinely secondary content. If everyone needs it, showing it costs nothing and hiding it costs readers. Use headings and prose.",
    },
    {
      title: "The browser closes the others",
      body: "Exclusivity is the native HTML name attribute on <details>: give a set of Details the same name and the browser itself closes the others when one opens: no state, no JS, and it holds even when JavaScript fails. But that native closing can yank content away from someone mid-read: when users may want two sections open to compare them, omit name and each section stays independent.",
    },
    {
      title: "No accordion component",
      body: "LoamUI deliberately ships no Accordion root and no separate Collapsible: one Details is the platform's complete disclosure widget, and a stack of them sharing a name is the accordion pattern. The grouping lives in HTML, where the browser can act on it; a wrapper component would only re-state what the name attribute already says.",
    },
  ],
  accessibility: [
    "Each Details is a real <details>/<summary>, so toggling, Enter/Space activation, focusability and the expanded/collapsed announcement all come from the platform. It works before and without JavaScript.",
    "Exclusive-set behaviour is the native name attribute on <details>: the browser enforces the exclusivity, so it holds even when JavaScript fails.",
    "The Summary text is the accessible name; the chevron is aria-hidden decoration, so screen readers hear only the label and the disclosure state.",
    "Because content lives in a real <details> element, Chromium-based browsers auto-open a closed section when find-in-page matches text inside it; collapsed content stays searchable.",
    "defaultOpen maps to the native open attribute, so a server-rendered page shows the expanded section correctly before hydration.",
  ],
  parts: [
    {
      name: "Details.Root",
      description: "The <details> element; all native details props are forwarded.",
      props: [
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Open by default (maps to the native open attribute).",
        },
        {
          name: "name",
          type: "string",
          description:
            "Native exclusivity: Details sharing a name form a set in which the browser keeps at most one open.",
        },
        {
          name: "...others",
          type: "DetailsHTMLAttributes<HTMLDetailsElement>",
          description: "All native <details> props are forwarded (onToggle, open, …).",
        },
      ],
    },
    {
      name: "Details.Summary",
      description:
        "The always-visible header line, rendered as a real <summary>; its children are the accessible name.",
    },
    {
      name: "Details.Content",
      description: "The revealed body: padded, muted prose. Any children.",
    },
  ],
};

export default doc;
