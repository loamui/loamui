import type { ComponentContent } from "@/renderer/types";
import { Tooltip } from "@loamui/core";

const sides = [
  ["Top", "top"],
  ["Bottom", "bottom"],
  ["Left", "left"],
  ["Right", "right"],
] as const;

export function TooltipSides() {
  return (
    <>
      {sides.map(([label, side]) => (
        <Tooltip.Root key={side}>
          <Tooltip.Trigger>{label}</Tooltip.Trigger>
          <Tooltip.Popup side={side}>On the {side}</Tooltip.Popup>
        </Tooltip.Root>
      ))}
    </>
  );
}

export function TooltipArrowDemo() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
      <Tooltip.Popup>
        Saved just now <Tooltip.Arrow />
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}

export function TooltipGroup() {
  return (
    <Tooltip.Provider>
      {["Cut", "Copy", "Paste"].map((label) => (
        <Tooltip.Root key={label}>
          <Tooltip.Trigger>{label}</Tooltip.Trigger>
          <Tooltip.Popup>
            {label} the selection <Tooltip.Arrow />
          </Tooltip.Popup>
        </Tooltip.Root>
      ))}
    </Tooltip.Provider>
  );
}

const doc: ComponentContent = {
  slug: "tooltip",
  lead: "A small floating label revealed on hover and keyboard focus, composed from parts.",
  importLine: `import { Tooltip } from "@loamui/core";`,
  demos: [
    {
      title: "Sides",
      description:
        "Place the bubble on any side of its target with the Popup's side prop. It opens after a short delay on hover, immediately on keyboard focus.",
      code: `<Tooltip.Root>
  <Tooltip.Trigger>Top</Tooltip.Trigger>
  <Tooltip.Popup side="top">On the top</Tooltip.Popup>
</Tooltip.Root>
<Tooltip.Root>
  <Tooltip.Trigger>Bottom</Tooltip.Trigger>
  <Tooltip.Popup side="bottom">On the bottom</Tooltip.Popup>
</Tooltip.Root>
<Tooltip.Root>
  <Tooltip.Trigger>Left</Tooltip.Trigger>
  <Tooltip.Popup side="left">On the left</Tooltip.Popup>
</Tooltip.Root>
<Tooltip.Root>
  <Tooltip.Trigger>Right</Tooltip.Trigger>
  <Tooltip.Popup side="right">On the right</Tooltip.Popup>
</Tooltip.Root>`,
      render: () => <TooltipSides />,
    },
    {
      title: "With arrow",
      description: "Compose Tooltip.Arrow inside the Popup for a pointer.",
      code: `<Tooltip.Root>
  <Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
  <Tooltip.Popup>
    Saved just now <Tooltip.Arrow />
  </Tooltip.Popup>
</Tooltip.Root>`,
      render: () => <TooltipArrowDemo />,
    },
    {
      title: "Grouped with a Provider",
      description:
        "Tooltip.Provider shares the hover delay across a group: after the first bubble opens, moving between adjacent triggers reveals instantly.",
      code: `<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>Cut</Tooltip.Trigger>
    <Tooltip.Popup>
      Cut the selection <Tooltip.Arrow />
    </Tooltip.Popup>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger>Copy</Tooltip.Trigger>
    <Tooltip.Popup>
      Copy the selection <Tooltip.Arrow />
    </Tooltip.Popup>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger>Paste</Tooltip.Trigger>
    <Tooltip.Popup>
      Paste the selection <Tooltip.Arrow />
    </Tooltip.Popup>
  </Tooltip.Root>
</Tooltip.Provider>`,
      render: () => <TooltipGroup />,
    },
  ],
  whenToUse: [
    "To label icon-only buttons or clarify what a control does: short, redundant, visual-only text.",
    "To expand an abbreviation or term in place for pointer and keyboard users.",
  ],
  whenNotToUse: [
    "For information the user needs to proceed: hover does not exist on touch devices, so essential content must be visible in the page.",
    "For interactive content (links, buttons), use Popover, which is click-invoked and keyboard-operable.",
    "As a replacement for a visible label on a form field, use Field.Label.",
  ],
  howItWorks: [
    {
      title: "Tooltips repeat, they never reveal",
      body: "A tooltip may only say what the page already makes knowable: the label of an icon button, the expansion of an abbreviation. Touch devices have no hover, so content that exists only in a tooltip does not exist for a large share of users.",
    },
    {
      title: "Same words as the accessible name",
      body: "On an icon-only button, the aria-label and the tooltip should say the same thing. If the tooltip wants to say more than the name, the extra is content: put it in the page or a Popover, not appended to a hover bubble.",
    },
    {
      title: "Nothing interactive inside",
      body: 'The bubble is role="tooltip" and never receives focus: a link or button inside it is unreachable by keyboard. The moment a tooltip needs a control, it is a Popover.',
    },
  ],
  accessibility: [
    "The trigger is permanently linked to the bubble via aria-describedby, so screen readers announce the text with the control whether or not it is visually shown.",
    "Escape dismisses the bubble without moving pointer or focus, the bubble stays open while hovered, and it persists until hover/focus leaves: the three requirements of WCAG 1.4.13 (Content on Hover or Focus).",
    "Opens immediately on visible (keyboard) focus with no hover delay; hover-open and tap-focus-open are both suppressed for touch pointers, where hover does not exist.",
    "Hover and keyboard focus are tracked independently, so a pointer passing over a focused trigger cannot steal the bubble away.",
    "Rendered with the native popover attribute (hint where the browser supports it, detected explicitly) and CSS anchor positioning where supported, with a wrapper-anchored fallback elsewhere: no polyfills, per the browser support policy.",
  ],
  parts: [
    {
      name: "Tooltip.Provider",
      description:
        "Optional. Shares one hover delay across a group, with instant opens between adjacent triggers.",
      props: [
        {
          name: "delay",
          type: "number",
          default: "600",
          description: "Hover delay in ms for all tooltips underneath.",
        },
      ],
    },
    {
      name: "Tooltip.Root",
      description:
        "Groups the parts and owns open state, timers, and Escape handling. Native <span> props are forwarded.",
      props: [
        {
          name: "delay",
          type: "number",
          default: "600",
          description: "Hover delay in ms; overrides the Provider.",
        },
        { name: "open", type: "boolean", description: "Controlled open state." },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Initial open state when uncontrolled.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Called whenever the open state should change.",
        },
      ],
    },
    {
      name: "Tooltip.Trigger",
      description:
        "A LoamUI Button wired with hover/focus handlers and aria-describedby; all native <button> props are forwarded.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description: "Substitute your own interactive element; it receives the wiring props.",
        },
      ],
    },
    {
      name: "Tooltip.Popup",
      description: 'The bubble (role="tooltip"); native <span> props are forwarded.',
      props: [
        {
          name: "side",
          type: `"top" | "bottom" | "left" | "right"`,
          default: `"top"`,
          description: "Which side of the trigger the bubble appears on.",
        },
      ],
    },
    {
      name: "Tooltip.Arrow",
      description: "Optional pointer arrow toward the trigger; native <span> props are forwarded.",
    },
  ],
  cssProps: [
    {
      name: "--loam-tooltip-size",
      syntax: "CSS length",
      default: "16rem",
      description: "The bubble's widest extent; shorter text shrink-wraps.",
    },
  ],
};

export default doc;
