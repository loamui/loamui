import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { SignpostLink } from "../../index.js";

const meta = {
  title: "Navigation/SignpostLink",
  component: SignpostLink,
  tags: ["autodocs"],
  args: {
    href: "#apply",
    children: "Start your application",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A prominent navigational link — the signpost to a task's " +
          "starting point. It is a real `<a>` (navigation, never an " +
          "action); the arrow is decoration, so assistive technology hears " +
          "only the label and the link role. Swap the element with `render`.",
      },
    },
  },
} satisfies Meta<typeof SignpostLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A context region recolours the arrow's circle like any solid fill. */
export const InContextRegion: Story = {
  render: (args) => (
    <div style={{ "--loam-context": "danger" } as CSSProperties}>
      <SignpostLink {...args} href="#appeal">
        Appeal this decision
      </SignpostLink>
    </div>
  ),
};

/**
 * Compose, don't configure: `render` substitutes the built-in `<a>` — here a
 * plain `<a>` standing in for a framework's router link — and the arrow
 * anatomy becomes the element's children. The label stays on SignpostLink.
 */
export const CustomElement: Story = {
  render: (args) => (
    <SignpostLink {...args} render={<a data-router-link href="#dashboard" />}>
      Go to your dashboard
    </SignpostLink>
  ),
};
