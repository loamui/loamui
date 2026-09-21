import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Badge } from "../../index.js";

const meta = {
  title: "Data display/Badge",
  component: Badge.Root,
  tags: ["autodocs"],
  args: {
    children: "Badge",
    size: "md",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Neutral by default — status is declared by context " +
          "(`--loam-context` on an ancestor region — a wrapper for a " +
          "single badge), not by props.",
      },
    },
  },
} satisfies Meta<typeof Badge.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Neutral by default — there is no variant or color prop. */
export const Default: Story = {};

/**
 * Declare `--loam-context` on a region — any ancestor; a one-element region
 * is a wrapper — and the tint and text derive from that status's colour.
 */
export const Contexts: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Badge.Root {...args}>
        <Badge.Text>Neutral</Badge.Text>
      </Badge.Root>
      <span style={{ "--loam-context": "primary" } as CSSProperties}>
        <Badge.Root {...args}>
          <Badge.Text>Primary</Badge.Text>
        </Badge.Root>
      </span>
      <span style={{ "--loam-context": "success" } as CSSProperties}>
        <Badge.Root {...args}>
          <Badge.Text>Success</Badge.Text>
        </Badge.Root>
      </span>
      <span style={{ "--loam-context": "warning" } as CSSProperties}>
        <Badge.Root {...args}>
          <Badge.Text>Warning</Badge.Text>
        </Badge.Root>
      </span>
      <span style={{ "--loam-context": "info" } as CSSProperties}>
        <Badge.Root {...args}>
          <Badge.Text>Info</Badge.Text>
        </Badge.Root>
      </span>
      <span style={{ "--loam-context": "danger" } as CSSProperties}>
        <Badge.Root {...args}>
          <Badge.Text>Danger</Badge.Text>
        </Badge.Root>
      </span>
    </div>
  ),
};

/** The status dot is a composed svg child; it follows the pill's text colour. */
export const WithDot: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Badge.Root {...args}>
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <circle cx="8" cy="8" r="4" />
        </svg>
        <Badge.Text>Offline</Badge.Text>
      </Badge.Root>
      <span style={{ "--loam-context": "success" } as CSSProperties}>
        <Badge.Root {...args}>
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="8" cy="8" r="4" />
          </svg>
          <Badge.Text>Online</Badge.Text>
        </Badge.Root>
      </span>
      <span style={{ "--loam-context": "warning" } as CSSProperties}>
        <Badge.Root {...args}>
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="8" cy="8" r="4" />
          </svg>
          <Badge.Text>Degraded</Badge.Text>
        </Badge.Root>
      </span>
    </div>
  ),
};

/** `render` swaps the element: a badge that is a link keeps the pill. */
export const AsLink: Story = {
  render: (args) => (
    <span style={{ "--loam-context": "info" } as CSSProperties}>
      <Badge.Root {...args} render={<a href="#tag-design" />}>
        <Badge.Text>design</Badge.Text>
      </Badge.Root>
    </span>
  ),
};

/** Icons are composed as svg children and detected with `:has(svg)`. */
export const WithIcon: Story = {
  render: (args) => (
    <span style={{ "--loam-context": "success" } as CSSProperties}>
      <Badge.Root {...args}>
        <svg viewBox="0 -0.5 25 25" fill="none" aria-hidden>
          <path
            d="M5.5 12.5L10.167 17L19.5 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Badge.Text>Verified</Badge.Text>
      </Badge.Root>
    </span>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Badge.Root {...args} size="sm">
        <Badge.Text>Small</Badge.Text>
      </Badge.Root>
      <Badge.Root {...args} size="md">
        <Badge.Text>Medium</Badge.Text>
      </Badge.Root>
      <Badge.Root {...args} size="lg">
        <Badge.Text>Large</Badge.Text>
      </Badge.Root>
    </div>
  ),
};
