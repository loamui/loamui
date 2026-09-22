import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Popover } from "../../index.js";

const meta = {
  title: "Overlays/Popover",
  component: Popover.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A click-triggered floating panel, composed from parts (Root, " +
          "Trigger, Popup, Title, Description, Close). The Popup uses the " +
          "native `popover` attribute for the top layer, light dismiss and " +
          "Escape, with CSS anchor positioning where supported and a " +
          "wrapper-anchored fallback elsewhere.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Popover.Root>
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Anchored panel</Popover.Title>
          <Popover.Description>
            Rendered in the top layer via the native popover attribute — click outside or press
            Escape to dismiss.
          </Popover.Description>
        </Popover.Popup>
      </Popover.Root>
    </div>
  ),
} satisfies Meta<typeof Popover.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Compose a panel from parts: Trigger, Popup, Title, Description, Close. */
export const Playground: Story = {};

/** The panel can open toward the bottom (default) or the top of its trigger. */
export const Sides: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "3rem",
        justifyContent: "center",
        padding: "5rem 3rem",
      }}
    >
      <Popover.Root>
        <Popover.Trigger>Opens down</Popover.Trigger>
        <Popover.Popup side="bottom">Anchored below.</Popover.Popup>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger>Opens up</Popover.Trigger>
        <Popover.Popup side="top">Anchored above.</Popover.Popup>
      </Popover.Root>
    </div>
  ),
};

/**
 * `Popover.Title` takes `render` so the heading level follows the page:
 * inside a section under an `<h2>`, the panel's heading is an `<h3>`.
 */
export const HeadingLevel: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Popover.Root>
        <Popover.Trigger>Quick settings</Popover.Trigger>
        <Popover.Popup>
          <Popover.Title render={<h3 />}>Settings</Popover.Title>
          <Popover.Description>The heading is an h3 here.</Popover.Description>
        </Popover.Popup>
      </Popover.Root>
    </div>
  ),
};

/** An explicit Close part inside the panel. */
export const WithClose: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Popover.Root>
        <Popover.Trigger>Quick settings</Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Settings</Popover.Title>
          <Popover.Description>A couple of preferences.</Popover.Description>
          <Popover.Close>Done</Popover.Close>
        </Popover.Popup>
      </Popover.Root>
    </div>
  ),
};

/**
 * The panel escapes ancestor overflow clipping: the trigger sits inside an
 * `overflow: hidden` box, yet the popup renders fully via the top layer.
 * (In fallback browsers this story degrades to a clipped panel — that is the
 * documented trade-off of the no-polyfill policy.)
 */
export const EscapesOverflowClipping: Story = {
  render: () => (
    <div
      style={{
        overflow: "hidden",
        blockSize: "5rem",
        border: "1px dashed var(--loam-color-line)",
        padding: "1rem",
        margin: "3rem",
      }}
    >
      <Popover.Root>
        <Popover.Trigger>Inside overflow:hidden</Popover.Trigger>
        <Popover.Popup>
          <Popover.Description>
            Top-layer rendering means this panel is not clipped by the dashed box.
          </Popover.Description>
        </Popover.Popup>
      </Popover.Root>
    </div>
  ),
};

/** Statically open (defaultOpen) — for visual/a11y review of the open state. */
export const OpenByDefault: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Anchored panel</Popover.Title>
          <Popover.Description>Should render directly beneath the trigger.</Popover.Description>
        </Popover.Popup>
      </Popover.Root>
    </div>
  ),
};

/**
 * Interaction test: clicking the trigger toggles the panel and wires
 * `aria-expanded`; light dismiss (outside click) and Escape both close it.
 */
export const TogglesAndDismisses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /open popover/i });

    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const popup = await within(document.body).findByRole("dialog");
    await expect(popup).toBeVisible();

    await userEvent.click(document.body);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  },
};
