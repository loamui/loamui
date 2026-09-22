import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox, Field } from "../../index.js";

const meta = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'A native `<input type="checkbox">` painted with the platform\'s own ' +
          "`accent-color`. Compose Field.Label and Field.Description around the native control.",
      },
    },
  },
  render: (args) => (
    <Field.Root>
      <Field.Label>
        <Checkbox {...args} /> I accept the terms and conditions
      </Field.Label>
    </Field.Root>
  ),
  args: {
    indeterminate: false,
    disabled: false,
    defaultChecked: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Required: Story = {
  args: { required: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const WithDescription: Story = {
  args: {},
};

export const WithError: Story = {
  render: (args) => (
    <Field.Root invalid>
      <Field.Error>You must accept the terms to continue.</Field.Error>
      <>
        <Field.Label>
          <Checkbox {...args} /> I accept the terms and conditions
        </Field.Label>
      </>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * A label-less `Checkbox` self-wires from the surrounding Field: it reads
 * its id from `Field.Root` (so `Field.Label` points at it) plus any
 * `aria-describedby`/`aria-invalid`, with no label or error props of its own.
 */
export const SelfWiringInField: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>I accept the terms and conditions</Field.Label>
      <Checkbox />
    </Field.Root>
  ),
};

/** Interaction test: the label toggles the native control, and Space toggles it from the keyboard. */
export const TogglesFromLabelAndKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("checkbox", { name: "I accept the terms and conditions" });
    await expect(box).not.toBeChecked();
    await userEvent.click(canvas.getByText("I accept the terms and conditions"));
    await expect(box).toBeChecked();
    box.focus();
    await userEvent.keyboard(" ");
    await expect(box).not.toBeChecked();
  },
};
