import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import type { CSSProperties } from "react";
import { Field } from "../../index.js";
import { QuantityInput } from "./index.js";

const meta = {
  title: "Inputs/QuantityInput",
  component: QuantityInput,
  tags: ["autodocs"],
  args: {
    defaultValue: 1,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'A count a person adjusts by one. A native `<input type="number">` is the ' +
          "value of record; the two Buttons step it through the input's own " +
          "`stepDown()` / `stepUp()` and fire a native `input` event, so forms, " +
          "`onChange` and constraint validation all see one value. Labelled by a " +
          "surrounding `Field`, like every bare control.",
      },
    },
  },
  render: (args) => (
    <Field.Root>
      <Field.Label>Quantity</Field.Label>
      <QuantityInput {...args} />
    </Field.Root>
  ),
} satisfies Meta<typeof QuantityInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Inside a Field the input takes the label's name and the buttons carry
 * their own ("Fewer", "More", replaced through `labels`). Two presses of
 * More take the default 1 to 3.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Quantity") as HTMLInputElement;
    const more = canvas.getByRole("button", { name: "More" });

    await userEvent.click(more);
    await userEvent.click(more);
    await expect(input.value).toBe("3");
  },
};

/**
 * The buttons disable at the bounds, so the ends are visible before they are
 * reached; a value typed past a bound is left for the Field to report.
 */
export const Bounds: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Seats</Field.Label>
      <Field.Description>Between 1 and 5.</Field.Description>
      <QuantityInput defaultValue={1} min={1} max={5} />
    </Field.Root>
  ),
};

function ControlledExample() {
  const [guests, setGuests] = useState(2);
  return (
    <Field.Root>
      <Field.Label>Guests: {guests}</Field.Label>
      <QuantityInput
        value={guests}
        min={1}
        max={8}
        onChange={(e) => setGuests(e.target.valueAsNumber)}
      />
    </Field.Root>
  );
}

/**
 * Controlled with `value` and `onChange`; the buttons still step the native
 * input, and the change arrives through `onChange` like a typed one.
 */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

/**
 * The buttons are core Buttons, so a `--loam-context` region recolours them
 * the way it recolours any action in it.
 */
export const InAContext: Story = {
  render: () => (
    <div style={{ "--loam-context": "primary" } as CSSProperties}>
      <Field.Root>
        <Field.Label>Tickets</Field.Label>
        <QuantityInput defaultValue={2} min={1} />
      </Field.Root>
    </div>
  ),
};
