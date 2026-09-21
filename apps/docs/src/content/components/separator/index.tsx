import { Separator } from "@loamui/core";
import type { ComponentContent } from "@/renderer/types";

const doc: ComponentContent = {
  slug: "separator",
  lead: "A native <hr> for boundaries that mean something: announced as a separator, not only drawn as a line.",
  importLine: `import { Separator } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description: "A real <hr>: the platform's separator role, no ARIA required.",
      code: `<p style={{ margin: 0 }}>Account settings</p>
<Separator />
<p>Danger zone</p>`,
      render: () => (
        <div style={{ display: "grid", gap: "var(--loam-space-xs)", inlineSize: "100%" }}>
          <p style={{ margin: 0 }}>Account settings</p>
          <Separator />
          <p>Danger zone</p>
        </div>
      ),
    },
    {
      title: "Vertical",
      description:
        'Divides items in a row; adds aria-orientation="vertical" and stretches to the row\'s height.',
      code: `<div style={{ display: "flex", gap: "var(--loam-space-xs)", alignItems: "center" }}>
  <span>Cut</span>
  <Separator orientation="vertical" />
  <span>Copy</span>
  <Separator orientation="vertical" />
  <span>Paste</span>
</div>`,
      render: () => (
        <div style={{ display: "flex", gap: "var(--loam-space-xs)", alignItems: "center" }}>
          <span>Cut</span>
          <Separator orientation="vertical" />
          <span>Copy</span>
          <Separator orientation="vertical" />
          <span>Paste</span>
        </div>
      ),
    },
  ],
  whenToUse: [
    "Between groups of related content where the division itself carries meaning: it is announced as a separator by assistive technology.",
    "Between inline items in a toolbar-like row (vertical form).",
  ],
  whenNotToUse: [
    "For purely visual division between layout areas. A border on the region is simpler and adds nothing to the accessibility tree.",
    "Inside a Menu. Menu.Separator exists for that and is already styled for menu padding.",
  ],
  howItWorks: [
    {
      title: "Meaningful division only",
      body: "An <hr> is announced to assistive technology as a separator, a real boundary between one group of content and the next. A line that is only visual rhythm belongs in CSS as a border, where it adds nothing to what a screen reader must walk through.",
    },
    {
      title: "Prefer space before rules",
      body: "Whitespace and headings usually divide content more quietly than a drawn line, and grouped controls have better tools (Fieldset, Card). Reach for Separator when groups genuinely need a marked boundary the eye and the screen reader should both register: a toolbar's action clusters, a footer's legal block.",
    },
  ],
  accessibility: [
    "Renders a native <hr>, which has the separator role built in.",
    'The vertical form adds aria-orientation="vertical" so the division is announced correctly in horizontal flows.',
  ],
  props: [
    {
      name: "orientation",
      type: `"horizontal" | "vertical"`,
      default: `"horizontal"`,
      description: "Direction of the rule.",
    },
    {
      name: "...others",
      type: "HTMLAttributes<HTMLHRElement>",
      description: "All native <hr> props are forwarded.",
    },
  ],
};

export default doc;
