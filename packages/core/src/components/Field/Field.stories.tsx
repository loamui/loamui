import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Input } from "../../index.js";

const meta = {
  title: "Inputs/Field",
  component: Field.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A composable form-field primitive. Assemble a labelled control from " +
          "small parts; the Root wires the label, `aria-describedby` and " +
          "`aria-invalid` for you. Parts can be reordered or swapped.",
      },
    },
  },
} satisfies Meta<typeof Field.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Field.Root style={{ maxWidth: 320 }}>
      <Field.Label>Email</Field.Label>
      <Field.Description>We&apos;ll only use this to reply.</Field.Description>
      <Field.Control render={<Input />} />
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root invalid style={{ maxWidth: 320 }}>
      <Field.Label>Email</Field.Label>
      <Field.Error>Enter a valid email address.</Field.Error>
      <Field.Control render={<Input defaultValue="not-an-email" />} />
    </Field.Root>
  ),
};

export const Optional: Story = {
  render: () => (
    <Field.Root style={{ maxWidth: 320 }}>
      <Field.Label optional>Company</Field.Label>
      <Field.Control render={<Input />} />
    </Field.Root>
  ),
};

export const ReorderedParts: Story = {
  render: () => (
    <Field.Root style={{ maxWidth: 320 }}>
      <Field.Control render={<Input />} />
      <Field.Label>Search</Field.Label>
      <Field.Description>Description below the control.</Field.Description>
    </Field.Root>
  ),
};
