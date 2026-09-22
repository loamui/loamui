import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import type { CSSProperties } from "react";
import { Progress } from "../../index.js";

const meta = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: {
    children: "Upload progress",
    value: 60,
    size: "md",
    striped: false,
    animated: false,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "The native `<progress>`, filled with the primary token and " +
          "re-coloured by any context region (`--loam-context` on a " +
          "region), not by props. Children are the visible label and the " +
          "bar's accessible name.",
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The children name the bar: assistive technology hears "Upload progress, 60%". */
export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("progressbar", { name: "Upload progress" });
    await expect(bar).toHaveAttribute("value", "60");
  },
};

/**
 * The bar IS the primary token, so a `--loam-context` region — any
 * ancestor; a one-element region is a wrapper — recolours it through the
 * token remap alone.
 */
export const Contexts: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Progress {...args}>Primary progress</Progress>
      <div style={{ "--loam-context": "success" } as CSSProperties}>
        <Progress {...args}>Success progress</Progress>
      </div>
      <div style={{ "--loam-context": "warning" } as CSSProperties}>
        <Progress {...args}>Warning progress</Progress>
      </div>
      <div style={{ "--loam-context": "info" } as CSSProperties}>
        <Progress {...args}>Info progress</Progress>
      </div>
      <div style={{ "--loam-context": "danger" } as CSSProperties}>
        <Progress {...args}>Danger progress</Progress>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Progress {...args} size="sm">
        Small progress
      </Progress>
      <Progress {...args} size="md">
        Medium progress
      </Progress>
      <Progress {...args} size="lg">
        Large progress
      </Progress>
    </div>
  ),
};

/** No `value`: work is under way and the amount is unknown. */
export const Indeterminate: Story = {
  args: { value: undefined, children: "Preparing your export" },
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("progressbar", { name: "Preparing your export" });
    await expect(bar).not.toHaveAttribute("value");
  },
};

/** `labels.value` writes the value in your words, read in place of the percentage. */
export const ValueLabel: Story = {
  args: {
    value: 75,
    children: "Importing contacts",
    labels: { value: (n) => `${Math.round(n / 25)} of 4 files` },
  },
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("progressbar", { name: "Importing contacts" });
    await expect(bar).toHaveAttribute("aria-valuetext", "3 of 4 files");
  },
};

/** Named from outside: no children, so `aria-label` names the bar. */
export const NamedByAttribute: Story = {
  args: { children: undefined, "aria-label": "Upload progress" },
};

export const Striped: Story = {
  args: { value: 45, striped: true, animated: true },
};
