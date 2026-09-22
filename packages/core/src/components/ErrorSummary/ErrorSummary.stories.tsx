import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button, ErrorSummary, Field, Input } from "../../index.js";

const meta = {
  title: "Inputs/ErrorSummary",
  component: ErrorSummary.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The form-level error pattern: a box at the top of the form listing " +
          "every error as a link to its field, shown after a failed submit. It " +
          "takes keyboard focus when it appears; each item links to a field by id.",
      },
    },
  },
} satisfies Meta<typeof ErrorSummary.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Shown after a failed submit: the summary takes focus, and each item links
 * to its field. Wording matches the fields' own error messages.
 */
export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxInlineSize: "28rem" }}>
      <ErrorSummary.Root autoFocus={false}>
        <ErrorSummary.Title />
        <ErrorSummary.List>
          <ErrorSummary.Item href="#es-email">Enter your email address</ErrorSummary.Item>
          <ErrorSummary.Item href="#es-name">Enter your full name</ErrorSummary.Item>
        </ErrorSummary.List>
      </ErrorSummary.Root>
      <Field.Root invalid id="es-name">
        <Field.Label>Full name</Field.Label>
        <Field.Error>Enter your full name</Field.Error>
        <Input />
      </Field.Root>
      <Field.Root invalid id="es-email">
        <Field.Label>Email address</Field.Label>
        <Field.Error>Enter your email address</Field.Error>
        <Input />
      </Field.Root>
      <div>
        <Button>Save and continue</Button>
      </div>
    </div>
  ),
};

/**
 * ErrorSummary takes focus when it appears (default `autoFocus`), so a keyboard
 * or assistive-technology user lands directly on the list of problems rather
 * than hunting from the top of the page (WCAG 3.3.1). Each item still links to
 * its field by id.
 */
export const FocusesOnAppear: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxInlineSize: "28rem" }}>
      <ErrorSummary.Root>
        <ErrorSummary.Title />
        <ErrorSummary.List>
          <ErrorSummary.Item href="#esf-email">Enter your email address</ErrorSummary.Item>
          <ErrorSummary.Item href="#esf-name">Enter your full name</ErrorSummary.Item>
        </ErrorSummary.List>
      </ErrorSummary.Root>
      <Field.Root invalid id="esf-name">
        <Field.Label>Full name</Field.Label>
        <Field.Error>Enter your full name</Field.Error>
        <Input />
      </Field.Root>
      <Field.Root invalid id="esf-email">
        <Field.Label>Email address</Field.Label>
        <Field.Error>Enter your email address</Field.Error>
        <Input />
      </Field.Root>
      <div>
        <Button>Save and continue</Button>
      </div>
    </div>
  ),
  /** Interaction test: the summary takes focus on appearance; an item's link moves focus to its field. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "There is a problem" })).toHaveFocus();
    await userEvent.click(canvas.getByRole("link", { name: "Enter your email address" }));
    await expect(canvas.getByRole("textbox", { name: "Email address" })).toHaveFocus();
  },
};
