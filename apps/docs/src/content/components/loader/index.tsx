import { Loader } from "@loamui/core";
import type { CSSProperties } from "react";
import type { ComponentContent } from "@/renderer/types";
import { Example } from "@/renderer/Example";

const doc: ComponentContent = {
  slug: "loader",
  lead: "An animated indicator for pending, indeterminate work.",
  importLine: `import { Loader } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "The spinner is the only anatomy: one indeterminate glyph, no variant prop. Pair it with visible words that say what is loading.",
      code: `<Loader />`,
      render: () => <Loader />,
    },
    {
      title: "Sizes",
      description:
        "size is one of three tokens, emitted as data-size and answered by the stylesheet. Without it the size comes from context: 1.5rem standalone, 1em inside a Button, or whatever a region sets --loam-loader-size to.",
      code: `<Loader size="sm" />
<Loader size="md" />
<Loader size="lg" />
<span style={{ "--loam-loader-size": "3rem" }}><Loader /></span>`,
      render: () => (
        <div
          style={{
            display: "flex",
            gap: "var(--loam-space-l)",
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <Example label="Small">
            <Loader size="sm" />
          </Example>
          <Example label="Medium">
            <Loader size="md" />
          </Example>
          <Example label="Large">
            <Loader size="lg" />
          </Example>
          <Example label="From a region: --loam-loader-size">
            <span style={{ "--loam-loader-size": "3rem" } as CSSProperties}>
              <Loader />
            </span>
          </Example>
        </div>
      ),
    },
    {
      title: "Contexts",
      description:
        "There is no colour prop. Declare --loam-context on a one-element wrapper region (see the Contextualism guide) and the status colours follow, or let it inherit from the region whose work it reports: a loader in a warning panel is already warning-coloured.",
      code: `<Loader />
<span style={{ "--loam-context": "primary" }}><Loader /></span>
<span style={{ "--loam-context": "success" }}><Loader /></span>
<span style={{ "--loam-context": "warning" }}><Loader /></span>
<span style={{ "--loam-context": "danger" }}><Loader /></span>
<span style={{ "--loam-context": "info" }}><Loader /></span>`,
      render: () => (
        <>
          <Loader />
          <span style={{ "--loam-context": "primary" } as CSSProperties}>
            <Loader />
          </span>
          <span style={{ "--loam-context": "success" } as CSSProperties}>
            <Loader />
          </span>
          <span style={{ "--loam-context": "warning" } as CSSProperties}>
            <Loader />
          </span>
          <span style={{ "--loam-context": "danger" } as CSSProperties}>
            <Loader />
          </span>
          <span style={{ "--loam-context": "info" } as CSSProperties}>
            <Loader />
          </span>
        </>
      ),
    },
  ],
  whenToUse: [
    "For waits of unknown duration where the shape of the outcome is also unknown: searching, saving, waiting on a third party.",
    "For small inline busy states, composed as a child of the affected control: a Button showing <Loader /> while it saves sizes it like an icon, no size prop needed.",
  ],
  whenNotToUse: [
    "When you know what the loaded content will look like: Skeleton holds the layout open and makes the swap calmer than a spinner in an empty region.",
    "When progress is measurable, use Progress with a truthful value; a spinner where a percentage exists withholds information the user could have.",
  ],
  howItWorks: [
    {
      title: "Pair it with words",
      body: 'A bare spinner says something is happening but not what, or whether the user should wait. Put visible text next to it and set label to the same words. The default "Loading" turns ambiguous as soon as a page has two waits.',
    },
    {
      title: "Hold it back briefly",
      body: "A spinner that flashes for 200ms reads as flicker, and one that appears instantly makes fast responses feel slow. Hold it back briefly (say 300ms) so quick operations complete without ever showing one; Skeleton is the better tool when the coming content's shape is known.",
    },
  ],
  accessibility: [
    'Renders role="status" (a polite live region), so a loader appearing in the DOM announces its label without interrupting what is currently being read.',
    "The label is exposed twice on purpose: as aria-label and as a visually hidden text node, so it reaches assistive tech regardless of how the role is mapped.",
    "The animated spinner is aria-hidden: assistive tech gets the label, never the animation structure.",
    "The spin exists only inside prefers-reduced-motion: no-preference; with reduced motion the glyph is a static indicator and the sr-only text still announces it, so meaning never depends on motion.",
    "When composed inside a Button as a busy state, add aria-hidden to the Loader and disable the button: the button's own text (“Saving”) should be the announcement, not a nested status region.",
  ],
  props: [
    {
      name: "size",
      type: `"sm" | "md" | "lg"`,
      description:
        "Overall size, emitted as data-size. When omitted, the size comes from context: 1.5rem standalone, 1em inside a Button (like an icon), or a region's --loam-loader-size.",
    },
    {
      name: "label",
      type: "string",
      default: `"Loading"`,
      description: "Accessible label announced to assistive tech.",
    },
    {
      name: "...others",
      type: "HTMLAttributes<HTMLSpanElement>",
      description: "All native <span> props are forwarded.",
    },
  ],
  contextual: true,
  cssProps: [
    {
      name: "--loam-loader-size",
      syntax: "CSS length",
      default: "1.5rem",
      description:
        "Public sizing hook, read with inheritance: a composing component can size a loader from its own context (Button sets it to 1em for composed spinners).",
    },
  ],
};

export default doc;
