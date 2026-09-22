import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "../../index.js";

const meta = {
  title: "Layout/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A rule between groups of content. Renders a real `<hr>` — the " +
          "platform's separator role — with an optional vertical " +
          "orientation for dividing items in a row.",
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", maxInlineSize: "24rem" }}>
      <p style={{ margin: 0 }}>Account settings</p>
      <Separator />
      <p style={{ margin: 0 }}>Danger zone</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <span>Cut</span>
      <Separator orientation="vertical" />
      <span>Copy</span>
      <Separator orientation="vertical" />
      <span>Paste</span>
    </div>
  ),
};
