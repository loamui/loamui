import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details } from "../../index.js";

const meta = {
  title: "Navigation/Details",
  component: Details.Root,
  tags: ["autodocs"],
  render: () => (
    <Details.Root>
      <Details.Summary>What is LoamUI?</Details.Summary>
      <Details.Content>A React component library built on the native web platform.</Details.Content>
    </Details.Root>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "The native `<details>`/`<summary>` disclosure, composed from " +
          "parts, with zero-JS toggling, find-in-page reveal, and " +
          "pre-hydration correctness. Share a `name` across several and the " +
          "browser enforces single-open natively.",
      },
    },
  },
} satisfies Meta<typeof Details.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Share a name and the browser enforces single-open natively. */
export const ExclusiveSet: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.5rem", width: "26rem" }}>
      <Details.Root name="extras" defaultOpen>
        <Details.Summary>Delivery</Details.Summary>
        <Details.Content>Orders ship within two working days.</Details.Content>
      </Details.Root>
      <Details.Root name="extras">
        <Details.Summary>Returns</Details.Summary>
        <Details.Content>Thirty days, no questions asked.</Details.Content>
      </Details.Root>
      <Details.Root name="extras">
        <Details.Summary>Support</Details.Summary>
        <Details.Content>Email us and a human replies.</Details.Content>
      </Details.Root>
    </div>
  ),
};
