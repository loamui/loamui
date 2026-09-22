import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Rating } from "./index.js";

const meta = {
  title: "Inputs/Rating",
  component: Rating,
  tags: ["autodocs"],
  args: {
    label: "Rate this recipe",
  },
  argTypes: {
    max: { control: { type: "number", min: 1, max: 10 } },
    value: { control: { type: "number", min: 0, max: 5, step: 0.5 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Stars that are real inputs: a fieldset of native radios, one per " +
          "star, so keyboard, exclusivity and form submission come from the " +
          "browser. `readOnly` turns the same stars into a picture of a " +
          "rating with one accessible name. Filled stars take the accent " +
          "colour, so a `--loam-context` region recolours them; the glyph " +
          "follows the surrounding type.",
      },
    },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing chosen yet. Arrow keys move the choice, as in any radio group. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const three = canvas.getByRole("radio", { name: "3 stars" });
    await userEvent.click(three);
    await expect(three).toBeChecked();

    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "4 stars" })).toBeChecked();

    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    await expect(canvas.getByRole("radio", { name: "2 stars" })).toBeChecked();
  },
};

/** An existing rating the user can change: the stars up to it are filled. */
export const Prefilled: Story = {
  args: { defaultValue: 4 },
};

/** Display mode: no radios, and a half star for the half. */
export const ReadOnly: Story = {
  args: { readOnly: true, label: "Average rating", value: 3.5 },
};

/** A region's context recolours the filled stars; there is no colour prop. */
export const InAContext: Story = {
  args: { readOnly: true, label: "Average rating", value: 4 },
  render: (args) => (
    <div style={{ "--loam-context": "success" } as CSSProperties}>
      <Rating {...args} />
    </div>
  ),
};

/** The label is always there for assistive tech; `showLabel` shows it to everyone. */
export const WithVisibleLabel: Story = {
  args: { showLabel: true, defaultValue: 2 },
};
