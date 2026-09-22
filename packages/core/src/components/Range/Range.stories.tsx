import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field, Range } from "../../index.js";

const meta = {
  title: "Inputs/Range",
  component: Range.Control,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'A styled `<input type="range">` for choosing a value from a range. ' +
          "Label it by composing Field — the control reads its id, description " +
          "and error wiring from the surrounding `Field.Root`.",
      },
    },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 40,
    disabled: false,
  },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <Field.Root>
      <Field.Label>Irrigation level</Field.Label>
      <Range.Control {...args} />
    </Field.Root>
  ),
} satisfies Meta<typeof Range.Control>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Steps: Story = {
  args: { min: 0, max: 10, step: 2, defaultValue: 4 },
  render: (args) => (
    <Field.Root>
      <Field.Label>Field count</Field.Label>
      <Range.Control {...args} />
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 70 },
};

/**
 * The bare control takes no error prop — the invalid state and description come
 * from Field. A present `Field.Error` marks the surrounding field invalid, and
 * the control self-wires `aria-invalid`/`aria-describedby` from Field context.
 */
export const WithError: Story = {
  render: (args) => (
    <Field.Root invalid>
      <Field.Label>Irrigation level</Field.Label>
      <Field.Error>Choose a level of at least 20</Field.Error>
      <Range.Control {...args} />
    </Field.Root>
  ),
};

/** Interaction test: the Field label names the slider; the arrow keys step its value. */
export const StepsWithArrowKeys: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider", { name: "Irrigation level" });
    await expect(slider).toHaveValue("40");
    slider.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(slider).toHaveValue("42");
    await userEvent.keyboard("{Home}");
    await expect(slider).toHaveValue("0");
  },
};
