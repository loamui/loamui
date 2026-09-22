import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { SegmentedControl } from "./index.js";

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

const meta = {
  title: "Inputs/SegmentedControl",
  component: SegmentedControl.Root,
  tags: ["autodocs"],
  args: {
    defaultValue: "week",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A set of mutually exclusive options drawn as one row of segments: a " +
          "native radio group in a pill (Root, Legend, Item). The radios submit " +
          "under `name`, so it is a form control; `onValueChange` makes it a view " +
          "switcher. The Legend names the group and is painted inside the pill; " +
          'hide it with `className="loam-VisuallyHidden"` when the segments say ' +
          "it themselves. The arrow keys move the choice, as on any radio group.",
      },
    },
  },
  render: (args) => (
    <SegmentedControl.Root {...args}>
      <SegmentedControl.Legend>Range</SegmentedControl.Legend>
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
    </SegmentedControl.Root>
  ),
} satisfies Meta<typeof SegmentedControl.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Icon-only segments sit in circles; each keeps hidden text as its name. */
export const IconsWithHiddenText: Story = {
  args: { defaultValue: "list" },
  render: (args) => (
    <SegmentedControl.Root {...args}>
      <SegmentedControl.Legend className="loam-VisuallyHidden">View</SegmentedControl.Legend>
      <SegmentedControl.Item value="list">
        <ListIcon />
        <span className="loam-VisuallyHidden">List</span>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="grid">
        <GridIcon />
        <span className="loam-VisuallyHidden">Grid</span>
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  ),
};

/** A disabled segment stays in the row, out of the choice. */
export const DisabledSegment: Story = {
  render: (args) => (
    <SegmentedControl.Root {...args}>
      <SegmentedControl.Legend>Range</SegmentedControl.Legend>
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month" disabled>
        Month
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  ),
};

function ViewSwitcher() {
  const [view, setView] = useState("list");
  return (
    <div style={{ display: "grid", gap: "var(--loam-space-xs)", justifyItems: "start" }}>
      <SegmentedControl.Root value={view} onValueChange={setView}>
        <SegmentedControl.Legend>View</SegmentedControl.Legend>
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      </SegmentedControl.Root>
      <p>Showing the {view}.</p>
    </div>
  );
}

/** Controlled: the consumer holds the value and the view follows it. */
export const AsViewSwitcher: Story = {
  render: () => <ViewSwitcher />,
};

/**
 * The arrow keys move the choice and check it, as on any native radio
 * group; the chosen segment is drawn from the radio's own `:checked`.
 */
export const ArrowKeysMoveTheChoice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const week = canvas.getByRole("radio", { name: "Week" });
    await expect(week).toBeChecked();

    week.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "Month" })).toBeChecked();
    await expect(week).not.toBeChecked();

    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    await expect(canvas.getByRole("radio", { name: "Day" })).toBeChecked();
  },
};
