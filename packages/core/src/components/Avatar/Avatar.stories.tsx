import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../index.js";

const meta = {
  title: "Data display/Avatar",
  component: Avatar.Root,
  tags: ["autodocs"],
  args: {
    role: "img",
    "aria-label": "Ada Lovelace",
    children: <Avatar.Fallback>AL</Avatar.Fallback>,
  },
} satisfies Meta<typeof Avatar.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
const portrait =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#ede9fe"/><circle cx="48" cy="38" r="18" fill="#6d28d9"/><path d="M16 84c0-17 14-28 32-28s32 11 32 28z" fill="#6d28d9"/></svg>',
  );
export const Image: Story = {
  render: (args) => (
    <Avatar.Root {...args}>
      <Avatar.Image src={portrait} alt="" />
      <Avatar.Fallback>AL</Avatar.Fallback>
    </Avatar.Root>
  ),
};
export const FailedImage: Story = {
  render: (args) => (
    <Avatar.Root {...args}>
      <Avatar.Image src="data:image/png,broken" alt="" />
      <Avatar.Fallback>AL</Avatar.Fallback>
    </Avatar.Root>
  ),
};
export const Contexts: Story = {
  render: (args) => (
    <span style={{ "--loam-context": "info" } as CSSProperties}>
      <Avatar.Root {...args} />
    </span>
  ),
};
export const Sizes: Story = {
  render: (args) => (
    <Avatar.Root {...args} style={{ "--loam-avatar-size": "4rem" } as CSSProperties} />
  ),
};
export const Group: Story = {
  render: () => (
    <Avatar.Group aria-label="Participants">
      <Avatar.Root role="img" aria-label="Ada Lovelace">
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root role="img" aria-label="Grace Hopper">
        <Avatar.Fallback>GH</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root role="img" aria-label="3 more people">
        <Avatar.Fallback>+3</Avatar.Fallback>
      </Avatar.Root>
    </Avatar.Group>
  ),
};
