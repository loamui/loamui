import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkipLink } from "../../index.js";

const meta = {
  title: "Navigation/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The first focusable element on the page: a link straight to the " +
          "main content, visible only while focused. Render it before " +
          "everything else, pointing at the main landmark's matching `id`.",
      },
    },
  },
  args: {
    href: "#content",
  },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tab into the story frame to see the link appear. */
export const Default: Story = {};
