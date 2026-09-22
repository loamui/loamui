import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Loader } from "../../index.js";

const meta = {
  title: "Feedback/Loader",
  component: Loader,
  tags: ["autodocs"],
  args: {
    size: "md",
    label: "Loading",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Coloured by the brand token — a `--loam-context` region " +
          "recolours it with no prop; a plain `color:` overrides.",
      },
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      <Loader {...args} size="sm" label="Small loader" />
      <Loader {...args} size="md" label="Medium loader" />
      <Loader {...args} size="lg" label="Large loader" />
    </div>
  ),
};

/**
 * A loader carries the accent by default. Each region here sets only
 * `--loam-context` — the bare loader inside re-answers the accent and
 * recolours with no prop of its own.
 */
export const Contexts: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      <Loader {...args} label="Default loader" />
      <span style={{ "--loam-context": "success" } as CSSProperties}>
        <Loader {...args} label="Success loader" />
      </span>
      <span style={{ "--loam-context": "warning" } as CSSProperties}>
        <Loader {...args} label="Warning loader" />
      </span>
      <span style={{ "--loam-context": "info" } as CSSProperties}>
        <Loader {...args} label="Info loader" />
      </span>
      <span style={{ "--loam-context": "danger" } as CSSProperties}>
        <Loader {...args} label="Danger loader" />
      </span>
    </div>
  ),
};

/**
 * The escape hatch: a plain `color:` on the loader overrides the accent
 * without touching context — for the rare indicator that must match a
 * specific surface rather than the brand.
 */
export const ColorOverride: Story = {
  render: (args) => (
    <Loader
      {...args}
      style={{ color: "var(--loam-color-fg-muted)" } as CSSProperties}
      label="Muted loader"
    />
  ),
};
