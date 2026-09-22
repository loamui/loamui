import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field, Textarea } from "../../index.js";

const meta = {
  title: "Inputs/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The bordered multi-line field: a native `<textarea>` in the shared " +
          "control box. Label it by composing Field — the control reads its " +
          "wiring from the surrounding `Field.Root`.",
      },
    },
  },
  args: {
    placeholder: "Write your message…",
    rows: 3,
    disabled: false,
  },
  argTypes: {
    rows: { control: { type: "number", min: 1, max: 12 } },
  },
  render: (args) => (
    <Field.Root>
      <Field.Label>Message</Field.Label>
      <Textarea {...args} />
    </Field.Root>
  ),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDescription: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Bio</Field.Label>
      <Field.Description>A short description shown on your public profile.</Field.Description>
      <Textarea />
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Message</Field.Label>
      <Field.Error>Message must be at least 20 characters.</Field.Error>
      <Textarea defaultValue="Too short" />
    </Field.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Feedback</Field.Label>
      <Textarea required />
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Interaction test: the Field label names the area and focuses it; typing reaches the native value. */
export const LabelFocusesAndTypes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole("textbox", { name: "Message" });
    await userEvent.click(canvas.getByText("Message"));
    await expect(area).toHaveFocus();
    await userEvent.type(area, "Two rows of oats, one of barley.");
    await expect(area).toHaveValue("Two rows of oats, one of barley.");
  },
};
