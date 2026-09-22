import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Drawer } from "../../index.js";
import type { DrawerSide } from "../../index.js";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An edge-anchored panel that slides in over the page, composed from parts. The Popup is a native `<dialog>` opened with `showModal()`, so top layer, backdrop, focus containment, Escape and focus restore all come from the browser — a Drawer is a Modal pinned to an edge.",
      },
    },
  },
  render: () => (
    <Drawer.Root>
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
    </Drawer.Root>
  ),
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compose the drawer from parts. The Popup is a native `<dialog>` opened with
 * `showModal()` — top layer, backdrop, focus containment, Escape and focus
 * restore all come from the browser. A Drawer is a Modal pinned to an edge.
 */
export const Playground: Story = {};

/** The panel slides in from whichever edge you anchor it to. */
export const Sides: Story = {
  render: () => (
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
              start/end set width; top/bottom set height. Both follow writing mode.
            </Drawer.Description>
            <Drawer.Close>Close</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Root>
      ))}
    </div>
  ),
};

/**
 * The panel is 24rem on its short axis by default (width for start/end,
 * height for top/bottom). Set `--loam-drawer-size` where the drawer is used
 * for a narrower or wider panel.
 */
export const PopupSize: Story = {
  render: () => (
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
  ),
};

/** A header row with an × close button — a composition pattern, not API. */
export const WithHeaderClose: Story = {
  render: () => (
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
  ),
};

/**
 * `render` swaps the trigger/close element; the dialog wiring is preserved.
 */
export const CustomTrigger: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger render={<button aria-label="Open menu">☰</button>} />
      <Drawer.Popup side="start">
        <Drawer.Title>Navigation</Drawer.Title>
        <Drawer.Description>Jump to a section of the app.</Drawer.Description>
        <Drawer.Close render={<button aria-label="Close">×</button>} />
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

/** Statically open (defaultOpen) — for visual/a11y review of the open state. */
export const OpenByDefault: Story = {
  render: () => (
    <Drawer.Root defaultOpen>
      <Drawer.Trigger>Open menu</Drawer.Trigger>
      <Drawer.Popup side="start">
        <Drawer.Title>Navigation</Drawer.Title>
        <Drawer.Description>Anchored to the inline-start edge, full height.</Drawer.Description>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

/**
 * Interaction test — real-browser coverage for the native behaviors jsdom
 * can't exercise: Escape closing and focus restoration to the trigger.
 */
export const OpensAndDismisses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /open menu/i });

    await userEvent.click(trigger);
    const dialog = document.querySelector("dialog")!;
    await expect(dialog.open).toBe(true);
    await expect(trigger).toHaveAttribute("data-popup-open", "true");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog.open).toBe(false));
    await waitFor(() => expect(trigger).not.toHaveAttribute("data-popup-open"));
    await expect(trigger).toHaveFocus();
  },
};
