import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field, Switch } from "../../index.js";

const meta = {
  title: "Inputs/Switch",
  component: Switch.Control,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'An on/off toggle built on a native checkbox with `role="switch"`. ' +
          "Compose Root, Control, Track and Thumb inside Field.Label. Field.Description and Field.Error supply supporting content.",
      },
    },
  },
  render: (args) => (
    <Field.Root>
      <Field.Label>
        <Switch.Root>
          <Switch.Control {...args} />
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
        </Switch.Root>{" "}
        Enable irrigation
      </Field.Label>
    </Field.Root>
  ),
  args: {
    defaultChecked: false,
    disabled: false,
  },
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch.Control>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const LabelPosition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Field.Item>
        <Field.Label>
          <Switch.Root>
            <Switch.Control {...args} />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          Label after control
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          Label before control{" "}
          <Switch.Root>
            <Switch.Control {...args} />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>
        </Field.Label>
      </Field.Item>
    </div>
  ),
};

export const WithDescription: Story = {
  args: {},
};

export const WithError: Story = {
  render: (args) => (
    <Field.Root invalid>
      <>
        <Field.Label>
          <Switch.Root>
            <Switch.Control {...args} />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          Two-factor authentication
        </Field.Label>
      </>
      <Field.Error>Two-factor authentication must be on for admin accounts</Field.Error>
    </Field.Root>
  ),
};

export const Required: Story = {
  args: { required: true },
};

/**
 * The bare `Switch.Control` self-wires from the surrounding Field, reading its id
 * and aria wiring from context; the inline-label form is the other shape, shown
 * elsewhere.
 */
export const SelfWiringInField: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>
        <Switch.Root>
          <Switch.Control />
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
        </Switch.Root>{" "}
        Enable irrigation
      </Field.Label>
    </Field.Root>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Field.Item>
        <Field.Label>
          <Switch.Root>
            <Switch.Control {...args} defaultChecked={false} />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          Off
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Switch.Root>
            <Switch.Control {...args} defaultChecked />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          On
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Switch.Root>
            <Switch.Control {...args} disabled defaultChecked={false} />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          Disabled off
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Switch.Root>
            <Switch.Control {...args} disabled defaultChecked />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          Disabled on
        </Field.Label>
      </Field.Item>
    </div>
  ),
};

/** Interaction test: the control is a switch, its label toggles it, and Space toggles it from the keyboard. */
export const TogglesFromLabelAndKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("switch", { name: "Enable irrigation" });
    await expect(control).not.toBeChecked();
    await userEvent.click(canvas.getByText("Enable irrigation"));
    await expect(control).toBeChecked();
    control.focus();
    await userEvent.keyboard(" ");
    await expect(control).not.toBeChecked();
  },
};
