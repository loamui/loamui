import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field } from "../../index.js";
import { PasswordInput } from "./index.js";

const meta = {
  title: "Inputs/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  args: {
    autoComplete: "current-password",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A password box with a toggle that shows what was typed: the " +
          "library's Input beside a Button whose name never changes and " +
          "whose `aria-pressed` carries the state. Labelled by a surrounding " +
          "`Field`, like every bare control.",
      },
    },
  },
  render: (args) => (
    <Field.Root>
      <Field.Label>Password</Field.Label>
      <PasswordInput name="password" {...args} />
    </Field.Root>
  ),
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pressing the toggle shows the text; the button keeps its name and reports pressed. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password");
    const toggle = canvas.getByRole("button", { name: "Show password" });

    await userEvent.type(input, "correct horse battery staple");
    await expect(input).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    await expect(input).toHaveAttribute("type", "text");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toHaveAccessibleName("Show password");
  },
};

/** A new password: the autofill purpose tells a password manager to save, not look up. */
export const NewPassword: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Choose a password</Field.Label>
      <Field.Description>At least 12 characters.</Field.Description>
      <PasswordInput name="new-password" autoComplete="new-password" />
    </Field.Root>
  ),
};

/** A Field.Error marks the box invalid, as it does any Input. */
export const WithError: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Password</Field.Label>
      <Field.Error>Enter your password</Field.Error>
      <PasswordInput name="password" autoComplete="current-password" />
    </Field.Root>
  ),
};

/** The toggle's words come from `labels`, for another language. */
export const InAnotherLanguage: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Mot de passe</Field.Label>
      <PasswordInput
        name="password"
        autoComplete="current-password"
        labels={{ show: "Afficher le mot de passe" }}
      />
    </Field.Root>
  ),
};
