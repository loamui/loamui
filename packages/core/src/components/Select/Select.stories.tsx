import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Select } from "../../index.js";

const frameworkOptions = (
  <>
    <option value="" disabled>
      Pick one
    </option>
    <option value="react">React</option>
    <option value="vue">Vue</option>
    <option value="svelte">Svelte</option>
    <option value="solid">Solid</option>
  </>
);

const meta = {
  title: "Inputs/Select",
  component: Select.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A native `<select>` with a fluid chevron; options are children " +
          "(`<option>` / `<optgroup>`), exactly as the platform defines them, " +
          "and so is an unanswered start: a leading disabled empty option is " +
          "where the select begins. Label it by composing Field — the control " +
          "reads its wiring from the surrounding `Field.Root`.",
      },
    },
  },
  args: {
    children: frameworkOptions,
    disabled: false,
  },
  render: (args) => (
    <Field.Root>
      <Field.Label>Framework</Field.Label>
      <Select.Root {...args} />
    </Field.Root>
  ),
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Grouped: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Instrument</Field.Label>
      <Select.Root>
        <Select.OptGroup label="Strings">
          <Select.Option>Violin</Select.Option>
          <Select.Option>Cello</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Brass">
          <Select.Option>Trumpet</Select.Option>
          <Select.Option disabled>Tuba (unavailable)</Select.Option>
        </Select.OptGroup>
      </Select.Root>
    </Field.Root>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>Framework</Field.Label>
      <Field.Description>You can change this later in settings.</Field.Description>
      <Select.Root {...args} />
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <Field.Root invalid>
      <Field.Label>Framework</Field.Label>
      <Field.Error>Select a framework</Field.Error>
      <Select.Root {...args} />
    </Field.Root>
  ),
};

export const Required: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>Framework</Field.Label>
      <Select.Root {...args} required />
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: "react", disabled: true },
};
