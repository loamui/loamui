import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Tooltip } from "../../index.js";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A small floating label revealed on hover and keyboard focus. Tooltips are visual-only — never put essential information in one, since hover is unavailable to touch users.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
      <Tooltip.Root>
        <Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
        <Tooltip.Popup>Saves your changes</Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compose from parts: the Trigger wires hover/focus and `aria-describedby`
 * onto the element it renders; the Popup is the bubble. Opens after a 600ms
 * delay on hover, immediately on keyboard focus.
 */
export const Playground: Story = {};

/** The bubble can point at any of the four sides of its target. */
export const Sides: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "2.5rem",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "3rem",
      }}
    >
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip.Root key={side} delay={0}>
          <Tooltip.Trigger>{side}</Tooltip.Trigger>
          <Tooltip.Popup side={side}>
            {side} <Tooltip.Arrow />
          </Tooltip.Popup>
        </Tooltip.Root>
      ))}
    </div>
  ),
};

/** Add a pointer arrow toward the target by composing `Tooltip.Arrow`. */
export const WithArrow: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
      <Tooltip.Root>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Popup>
          Now with a pointer <Tooltip.Arrow />
        </Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
};

/**
 * The trigger element is swappable via `render`; the tooltip wiring
 * (aria-describedby, hover/focus) is preserved.
 */
export const CustomTrigger: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
      <Tooltip.Root>
        <Tooltip.Trigger render={<button aria-label="Help">?</button>} />
        <Tooltip.Popup>
          Read the docs <Tooltip.Arrow />
        </Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
};

/**
 * `Tooltip.Provider` shares one delay across a group: after the first bubble
 * shows, moving between adjacent triggers opens instantly.
 */
export const ProviderGroup: Story = {
  render: () => (
    <Tooltip.Provider>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          padding: "3rem",
        }}
      >
        {["Cut", "Copy", "Paste"].map((label) => (
          <Tooltip.Root key={label}>
            <Tooltip.Trigger>{label}</Tooltip.Trigger>
            <Tooltip.Popup>{label} the selection</Tooltip.Popup>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  ),
};

/**
 * Forced flip: the trigger sits at the viewport's top edge while requesting
 * `side="top"`, so `position-try` flips the bubble below — and in
 * browsers with anchored container queries (Chrome 143+) the arrow follows,
 * moving to the bubble's top edge and pointing back up at the trigger.
 */
export const FlipsAtViewportEdge: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ blockSize: "16rem", position: "relative" }}>
      <div
        style={{
          position: "fixed",
          insetBlockStart: 0,
          insetInlineStart: "50%",
          translate: "-50% 0",
        }}
      >
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Near the top edge</Tooltip.Trigger>
          <Tooltip.Popup side="top">
            Flipped below — arrow points up <Tooltip.Arrow />
          </Tooltip.Popup>
        </Tooltip.Root>
      </div>
    </div>
  ),
};

/** Statically open (defaultOpen) — for visual/a11y review of the open state. */
export const OpenByDefault: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
        <Tooltip.Popup>
          Should sit centred above the trigger <Tooltip.Arrow />
        </Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
};

/**
 * Interaction test: revealed on hover (delay 0 for determinism) and keyboard
 * focus; Escape dismisses without moving focus (WCAG 1.4.13); the trigger is
 * permanently linked via `aria-describedby`.
 */
export const RevealsAndDismisses: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
        <Tooltip.Popup>Saves your changes</Tooltip.Popup>
      </Tooltip.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /hover or focus me/i });
    const tooltip = document.getElementById(
      trigger.getAttribute("aria-describedby")!.split(" ").pop()!,
    )!;

    await expect(tooltip).not.toBeVisible();

    await userEvent.hover(trigger);
    await waitFor(() => expect(tooltip).toBeVisible());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(tooltip).not.toBeVisible());

    await userEvent.unhover(trigger);
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(tooltip).toBeVisible());
  },
};
