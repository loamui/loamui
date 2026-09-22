import type { CSSProperties } from "react";
import type { ComponentContent } from "@/renderer/types";
import type { DrawerSide } from "@loamui/core";
import { Drawer } from "@loamui/core";

const navLinks = ["Dashboard", "Orders", "Customers", "Settings"];

function DrawerNav() {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--loam-space-xs)",
        marginBlock: "var(--loam-space-2xs)",
      }}
    >
      {navLinks.map((label) => (
        <a
          key={label}
          href={`#${label.toLowerCase()}`}
          style={{ color: "var(--loam-color-fg)", textDecoration: "none" }}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

export function DrawerDemo() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>Open menu</Drawer.Trigger>
      <Drawer.Popup side="start">
        <Drawer.Title>Navigation</Drawer.Title>
        <Drawer.Description>Jump to a section of the app.</Drawer.Description>
        <DrawerNav />
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  );
}

export function DrawerSidesDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--loam-space-2xs)",
        alignItems: "center",
      }}
    >
      {(["start", "end", "top", "bottom"] as DrawerSide[]).map((side) => (
        <Drawer.Root key={side}>
          <Drawer.Trigger>From {side}</Drawer.Trigger>
          <Drawer.Popup side={side}>
            <Drawer.Title>Side: {side}</Drawer.Title>
            <Drawer.Description>
              start/end set the panel width; top/bottom set its height. Both follow writing mode.
            </Drawer.Description>
            <Drawer.Close>Close</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Root>
      ))}
    </div>
  );
}

export function DrawerPopupSizeDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--loam-space-2xs)",
        alignItems: "center",
      }}
    >
      {(["18rem", "24rem", "30rem"] as const).map((size) => (
        <Drawer.Root key={size}>
          <Drawer.Trigger>Open {size}</Drawer.Trigger>
          <Drawer.Popup side="end" style={{ "--loam-drawer-size": size } as CSSProperties}>
            <Drawer.Title>A {size} drawer</Drawer.Title>
            <Drawer.Description>The width comes from one custom property.</Drawer.Description>
            <Drawer.Close>Close</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Root>
      ))}
    </div>
  );
}

export function DrawerHeaderCloseDemo() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>Filters</Drawer.Trigger>
      <Drawer.Popup side="end">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBlockEnd: "var(--loam-space-2xs)",
          }}
        >
          <Drawer.Title style={{ margin: 0 }}>Filters</Drawer.Title>
          <Drawer.Close aria-label="Close">×</Drawer.Close>
        </div>
        <Drawer.Description>Refine the results shown in the list.</Drawer.Description>
      </Drawer.Popup>
    </Drawer.Root>
  );
}

const doc: ComponentContent = {
  slug: "drawer",
  lead: "An edge-anchored panel that slides in over the page, built on the native <dialog> element and the browser's top layer.",
  importLine: `import { Drawer } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "Compose the drawer from parts. The Popup is a native <dialog> opened with showModal(): top layer, backdrop, focus containment, Escape and focus restore all come from the browser. A Drawer is a Modal pinned to an edge with a slide transition.",
      code: `<Drawer.Root>
  <Drawer.Trigger>Open menu</Drawer.Trigger>
  <Drawer.Popup side="start">
    <Drawer.Title>Navigation</Drawer.Title>
    <Drawer.Description>Jump to a section of the app.</Drawer.Description>
    <nav style={{ display: "flex", flexDirection: "column", gap: "var(--loam-space-xs)" }}>
      <a href="#dashboard">Dashboard</a>
      <a href="#orders">Orders</a>
      <a href="#customers">Customers</a>
      <a href="#settings">Settings</a>
    </nav>
    <Drawer.Close>Close</Drawer.Close>
  </Drawer.Popup>
</Drawer.Root>`,
      render: () => <DrawerDemo />,
    },
    {
      title: "Sides",
      description:
        "side anchors the panel to an edge and picks the slide direction. It is logical (start / end / top / bottom), so start and end follow the writing mode: inline-start is the left in LTR, the right in RTL.",
      code: `{(["start", "end", "top", "bottom"] as const).map((side) => (
  <Drawer.Root key={side}>
    <Drawer.Trigger>From {side}</Drawer.Trigger>
    <Drawer.Popup side={side}>
      <Drawer.Title>Side: {side}</Drawer.Title>
      <Drawer.Description>
        start/end set the panel width; top/bottom set its height. Both follow writing mode.
      </Drawer.Description>
      <Drawer.Close>Close</Drawer.Close>
    </Drawer.Popup>
  </Drawer.Root>
))}`,
      render: () => <DrawerSidesDemo />,
    },
    {
      title: "Popup size",
      description:
        "The panel is 24rem on its short axis by default: the width for start / end, the height for top / bottom. The long axis always fills the viewport. Set --loam-drawer-size where the drawer is used for a narrower or wider panel.",
      code: `{(["18rem", "24rem", "30rem"] as const).map((size) => (
  <Drawer.Root key={size}>
    <Drawer.Trigger>Open {size}</Drawer.Trigger>
    <Drawer.Popup side="end" style={{ "--loam-drawer-size": size }}>
      <Drawer.Title>A {size} drawer</Drawer.Title>
      <Drawer.Description>The width comes from one custom property.</Drawer.Description>
      <Drawer.Close>Close</Drawer.Close>
    </Drawer.Popup>
  </Drawer.Root>
))}`,
      render: () => <DrawerPopupSizeDemo />,
    },
    {
      title: "Header with a close button",
      description:
        "A header row with an × is a composition pattern, not configuration: compose Drawer.Title and Drawer.Close however your design needs.",
      code: `<Drawer.Root>
  <Drawer.Trigger>Filters</Drawer.Trigger>
  <Drawer.Popup side="end">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBlockEnd: "var(--loam-space-2xs)",
      }}
    >
      <Drawer.Title style={{ margin: 0 }}>Filters</Drawer.Title>
      <Drawer.Close aria-label="Close">×</Drawer.Close>
    </div>
    <Drawer.Description>Refine the results shown in the list.</Drawer.Description>
  </Drawer.Popup>
</Drawer.Root>`,
      render: () => <DrawerHeaderCloseDemo />,
    },
  ],
  whenToUse: [
    "For navigation and secondary content that shouldn't take over the whole screen: a mobile menu, a filter panel, a details side-sheet.",
    "When the surrounding page context should stay visible behind a dimmed backdrop, and the panel is casually dismissible.",
    "On narrow screens, to hold navigation that sits in a persistent sidebar on wider ones.",
  ],
  whenNotToUse: [
    "For a focused, must-answer task or a destructive confirmation, use Modal to centre the dialog on the decision.",
    "For a small set of actions opened from a control, use Menu; for supplementary content anchored to a trigger, use Popover.",
    "For primary navigation that fits on wide screens, use a persistent sidebar or nav bar rather than hiding it behind a trigger.",
  ],
  howItWorks: [
    {
      title: "Anchor to a logical edge",
      body: "side is logical, not physical: start and end follow the writing mode so a start drawer opens from the left in LTR and the right in RTL, matching where users expect the back edge to be. Reach for top / bottom for sheets: a bottom sheet is the thumb-friendly choice for actions on touch devices.",
    },
    {
      title: "A drawer is dismissible by nature",
      body: "Unlike an alert dialog, a drawer light-dismisses: clicking the backdrop or pressing Escape closes it. That is the right contract for navigation and browsing. Never put a decision the user must not dismiss by accident in a drawer; use Modal's alert for that.",
    },
    {
      title: "Always render a Title",
      body: 'Drawer.Title labels the dialog via aria-labelledby; it is what screen readers announce on open. A drawer used purely for navigation should still carry a Title (for example "Navigation") so its purpose is announced, even if you hide it visually; a Popup with neither a Title nor an aria-label is reported in development.',
    },
    {
      title: "Keep the trigger where the focus returns",
      body: "The browser restores focus to the trigger when the drawer closes. Keep a single, stable trigger (a hamburger button) rather than swapping it out while open, so keyboard and screen-reader users land back where they started.",
    },
  ],
  accessibility: [
    "Built on the native <dialog> opened with showModal(): the browser provides the top layer, ::backdrop, real focus containment, Escape handling, and restores focus to the trigger on close, none of it re-implemented in JavaScript.",
    "Drawer.Title and Drawer.Description automatically label and describe the dialog via aria-labelledby / aria-describedby.",
    'Drawer.Trigger carries aria-haspopup="dialog" and aria-expanded, which follows the open state, so a screen reader says what the button opens and whether it is open.',
    "Light dismiss (clicking the backdrop) uses the closedby attribute where supported, with a small feature-detected coordinate-check fallback elsewhere: no polyfills, per the browser support policy.",
    "The slide transition lives inside prefers-reduced-motion: no-preference, so users who ask for reduced motion get an instant open with no movement.",
    "A forced-colors border keeps the panel edge visible when background colours are overridden; body scroll is locked while open.",
  ],
  parts: [
    {
      name: "Drawer.Root",
      description:
        "Groups the parts and owns open state (controlled or uncontrolled). Renders no element of its own.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Uncontrolled initial state.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Fires when the drawer opens or closes.",
        },
      ],
    },
    {
      name: "Drawer.Trigger",
      description: "A LoamUI Button that opens the drawer.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description: "Substitute your own action element (an icon button); the wiring merges on.",
        },
        {
          name: "...others",
          type: "ButtonHTMLAttributes",
          description: "Forwarded to the button.",
        },
      ],
    },
    {
      name: "Drawer.Popup",
      description:
        "The native <dialog>. side anchors it to an edge and sets the slide direction; the short-axis extent comes from --loam-drawer-size.",
      props: [
        {
          name: "side",
          type: '"start" | "end" | "top" | "bottom"',
          default: '"start"',
          description: "Edge to anchor to.",
        },
      ],
    },
    {
      name: "Drawer.Title / Drawer.Description",
      description: "Label and describe the dialog for assistive technology.",
    },
    {
      name: "Drawer.Close",
      description:
        "A LoamUI Button that closes the drawer; compose as many as you need (a footer action, a header ×). Native <button> props are forwarded.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description: "Substitute your own element; it receives the close wiring.",
        },
      ],
    },
  ],
  cssProps: [
    {
      name: "--loam-drawer-size",
      syntax: "CSS length",
      default: "24rem",
      description:
        "The panel's short-axis extent: width for start/end, height for top/bottom. The panel never exceeds the viewport either way.",
    },
  ],
};

export default doc;
