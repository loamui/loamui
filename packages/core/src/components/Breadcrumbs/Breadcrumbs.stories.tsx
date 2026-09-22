import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "../../index.js";

const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shows the path to the current page. Items are links via `href`, plain text when `current`, or any element via `render`; the consumer marks the current page explicitly and separators are drawn in CSS from the public `--loam-breadcrumbs-separator` property, not the DOM.",
      },
    },
  },
  render: (args) => (
    <Breadcrumbs.Root {...args}>
      <Breadcrumbs.Item href="#root">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#crops">Crops</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#wheat">Wheat</Breadcrumbs.Item>
      <Breadcrumbs.Item current>Winter varieties</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
} satisfies Meta<typeof Breadcrumbs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * A custom separator glyph: set the public `--loam-breadcrumbs-separator`
 * property (a CSS string) where the trail is used; CSS draws it.
 */
export const CustomSeparator: Story = {
  render: (args) => (
    <Breadcrumbs.Root {...args} style={{ "--loam-breadcrumbs-separator": '"›"' } as CSSProperties}>
      <Breadcrumbs.Item href="#root">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#crops">Crops</Breadcrumbs.Item>
      <Breadcrumbs.Item current>Wheat</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
};

/** A short two-level trail. */
export const ShortTrail: Story = {
  render: (args) => (
    <Breadcrumbs.Root {...args}>
      <Breadcrumbs.Item href="#root">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item current>Dashboard</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
};

/** The current page can itself be a link (aria-current stays correct). */
export const CurrentAsLink: Story = {
  render: (args) => (
    <Breadcrumbs.Root {...args}>
      <Breadcrumbs.Item href="#root">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#fields">Fields</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#north" current>
        North paddock
      </Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
};

/** A truncated path — `current` is explicit, so it needn't be last. */
export const Truncated: Story = {
  render: (args) => (
    <Breadcrumbs.Root {...args}>
      <Breadcrumbs.Item href="#root">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item aria-hidden>…</Breadcrumbs.Item>
      <Breadcrumbs.Item current>Billing</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
};

/**
 * Compose, don't configure: `render` swaps the built-in element for a
 * framework's link while the breadcrumb structure and aria stay.
 */
export const CustomElement: Story = {
  render: (args) => (
    <Breadcrumbs.Root {...args}>
      <Breadcrumbs.Item render={<a data-router-link href="#root" />}>Home</Breadcrumbs.Item>
      <Breadcrumbs.Item render={<a data-router-link href="#fields" />}>Fields</Breadcrumbs.Item>
      <Breadcrumbs.Item current>North paddock</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
};
