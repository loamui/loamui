import { Card, Button } from "@loamui/core";
import type { ComponentContent } from "@/renderer/types";

const doc: ComponentContent = {
  slug: "card",
  lead: "A surface container that groups related content: the one surface primitive, which compositions such as a product card or a testimonial are built on rather than restyling.",
  importLine: `import { Card, Button } from "@loamui/core";`,
  demos: [
    {
      title: "Basic card",
      description: "A padded surface holding a heading, text, and an action.",
      code: `<Card>
  <h3>Weekly summary</h3>
  <p>Your team shipped 12 tasks this week. Review activity and plan the next sprint.</p>
  <Button>View report</Button>
</Card>`,
      render: () => (
        <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
          <Card>
            <h3>Weekly summary</h3>
            <p>Your team shipped 12 tasks this week. Review activity and plan the next sprint.</p>
            <Button>View report</Button>
          </Card>
        </div>
      ),
    },
    {
      title: "Another element",
      description:
        "render substitutes the <div>: an <li> in a list of cards, a <label> when the whole surface is a control's label, an <article> for a self-contained piece. The class and attributes merge onto the element.",
      code: `<ul>
  <Card render={<li />}>North Field</Card>
  <Card render={<li />}>South Field</Card>
</ul>`,
      render: () => (
        <ul
          style={{
            display: "grid",
            gap: "var(--loam-space-xs)",
            listStyle: "none",
            margin: 0,
            padding: 0,
            inlineSize: "100%",
            maxInlineSize: "22rem",
          }}
        >
          <Card render={<li />}>North Field</Card>
          <Card render={<li />}>South Field</Card>
        </ul>
      ),
    },
  ],
  whenToUse: [
    "To group related content (a heading, supporting text, an action) onto one surface so it reads as a single unit.",
    "To lift a region off the page background where the boundary matters: the card is a quiet bordered surface, one fixed look.",
  ],
  whenNotToUse: [
    "As a control. Card renders a <div> with no role, focus or keyboard behaviour, and putting onClick on it creates a target keyboards and screen readers cannot reach (see below for the accessible whole-card pattern).",
    "Around everything on the page. When every region is a card, no region stands out, and the borders become visual noise that plain document flow would avoid.",
  ],
  howItWorks: [
    {
      title: "A surface, not a control",
      body: "Card is deliberately nothing more than a styled <div>: no role, no tabindex, no cursor. If the whole card should be clickable, the accessible pattern is one real <a> inside it (usually on the card's heading) stretched over the surface with an ::after covering the card. Keyboard users get one tab stop, screen readers get a real link with a real name, and right-click / open-in-new-tab keep working. A click handler on the div gives you none of that.",
    },
    {
      title: "Cards are skimmed by their headings",
      body: "Screen-reader users navigate by heading; sighted users scan the same way. Start each card with one heading at the level the page's outline requires (a grid of cards under an <h2> section takes <h3>s) rather than styled bold text, so the grid is traversable without reading every card.",
    },
  ],
  accessibility: [
    "Renders a plain <div> with no role: all semantics come from what you put inside, so use real headings, lists and links rather than styled text.",
    "The card draws no focus ring of its own because it is never a focus target; interactive children keep their own :focus-visible treatment.",
    "Border and shadow are purely visual grouping, invisible to assistive tech, so the content must also read as a unit in document order alone.",
  ],
  props: [
    {
      name: "render",
      type: "element | (props) => node",
      description:
        "Substitute the rendered element (render={<li />}, render={<label />}, render={<article />}); the Card's class and attributes merge onto it.",
    },
    {
      name: "...others",
      type: "DivHTMLAttributes",
      description: "All native <div> props are forwarded.",
    },
  ],
};

export default doc;
