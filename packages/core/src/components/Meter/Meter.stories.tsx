import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import type { CSSProperties } from "react";
import { Meter } from "./Meter.js";

const meta = {
  title: "Feedback/Meter",
  component: Meter,
  tags: ["autodocs"],
  args: {
    label: "Storage used",
    value: 0.6,
    size: "md",
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A measurement within a known range on the native `<meter>` — " +
          "not progress toward completion (that is Progress). Give it " +
          "`low`, `high` and `optimum` and the browser picks the band; " +
          "without bands the fill is the primary token, re-coloured by any " +
          "`--loam-context` region.",
      },
    },
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The element carries the meter role; `label` gives it the name it lacks. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole("meter", { name: "Storage used" });
    await expect(meter).toHaveAttribute("value", "0.6");
  },
};

/**
 * One meter, three values: the browser reads `low`, `high` and `optimum`
 * and paints the band the value falls in — success, warning or danger —
 * with no colour prop involved.
 */
export const Bands: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Meter
        {...args}
        label="Weak password"
        value={25}
        max={100}
        low={40}
        high={75}
        optimum={100}
      />
      <Meter
        {...args}
        label="Fair password"
        value={55}
        max={100}
        low={40}
        high={75}
        optimum={100}
      />
      <Meter
        {...args}
        label="Strong password"
        value={90}
        max={100}
        low={40}
        high={75}
        optimum={100}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Meter {...args} label="Small meter" size="sm" />
      <Meter {...args} label="Medium meter" size="md" />
      <Meter {...args} label="Large meter" size="lg" />
    </div>
  ),
};

/**
 * Without bands the fill IS the primary token, so a `--loam-context`
 * region — any ancestor; a one-element region is a wrapper — recolours
 * it through the token remap alone.
 */
export const InAContext: Story = {
  render: (args) => (
    <div style={{ "--loam-context": "warning" } as CSSProperties}>
      <Meter {...args} label="Quota used" value={0.85} />
    </div>
  ),
};

/**
 * Children are the fallback text for a browser without `<meter>`; the
 * default is the value as a percentage of the range.
 */
export const Fallback: Story = {
  args: { label: "Disk used", value: 320, max: 500, children: "320 GB of 500 GB" },
};
