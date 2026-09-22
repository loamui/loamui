import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Avatar, Skeleton } from "../../index.js";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: {
    visible: true,
  },
  argTypes: {
    visible: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A placeholder shown while content loads. Wrapped children size " +
          "the box so it mirrors the coming layout; a bare placeholder is " +
          "one text line, sized from CSS through the public " +
          "`--loam-skeleton-inline-size` / `--loam-skeleton-block-size` " +
          "properties. There are no size props.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: "20rem" }}>
      <Skeleton {...args} />
    </div>
  ),
};

/** Bare lines are one text line tall; the inline size is a CSS decision. */
export const TextLines: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxInlineSize: "20rem",
      }}
    >
      <Skeleton {...args} />
      <Skeleton {...args} style={{ "--loam-skeleton-inline-size": "90%" } as CSSProperties} />
      <Skeleton {...args} style={{ "--loam-skeleton-inline-size": "75%" } as CSSProperties} />
    </div>
  ),
};

/** A circle is a wrapped Avatar: the child sizes and shapes the placeholder. */
export const Circle: Story = {
  render: (args) => (
    <Skeleton {...args}>
      <Avatar.Root role="img" aria-label="Ada Lovelace">
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar.Root>
    </Skeleton>
  ),
};

export const Card: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
        maxInlineSize: "20rem",
      }}
    >
      <Skeleton {...args}>
        <Avatar.Root role="img" aria-label="Ada Lovelace">
          <Avatar.Fallback>AL</Avatar.Fallback>
        </Avatar.Root>
      </Skeleton>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flex: 1,
        }}
      >
        <Skeleton {...args} style={{ "--loam-skeleton-inline-size": "60%" } as CSSProperties} />
        <Skeleton {...args} />
      </div>
    </div>
  ),
};

/** A thumbnail: both sizes from CSS, the shape from `--loam-skeleton-radius`. */
export const Thumbnail: Story = {
  render: (args) => (
    <Skeleton
      {...args}
      style={
        {
          "--loam-skeleton-inline-size": "8rem",
          "--loam-skeleton-block-size": "8rem",
          "--loam-skeleton-radius": "var(--loam-radius-lg)",
        } as CSSProperties
      }
    />
  ),
};

export const RevealsContent: Story = {
  args: {
    visible: false,
    children: <span>Loaded content is now visible.</span>,
  },
};
