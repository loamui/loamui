import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field } from "../../index.js";
import { FileInput } from "./index.js";

const meta = {
  title: "Inputs/FileInput",
  component: FileInput.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'A file picker built on the native `<input type="file">`. The input is ' +
          "the control and the Prompt is its label, so the box opens the picker " +
          "and keyboard users reach the input inside it. Drag and drop is an " +
          "enhancement on the Root: a dropped file lands in the same input. The " +
          "Files list is a polite live region, so the choice is announced as " +
          "well as shown.",
      },
    },
  },
  render: () => (
    <Field.Root>
      <Field.Label>Passport scan</Field.Label>
      <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
      <FileInput.Root>
        <FileInput.Control accept=".pdf,.png" />
        <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
        <FileInput.Files />
      </FileInput.Root>
    </Field.Root>
  ),
} satisfies Meta<typeof FileInput.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `multiple` forwards to the input; a drop of several files keeps them all. */
export const Multiple: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Supporting documents</Field.Label>
      <Field.Description>PDF or PNG, up to 5 MB each</Field.Description>
      <FileInput.Root>
        <FileInput.Control accept=".pdf,.png" multiple />
        <FileInput.Prompt>Choose files or drop them here</FileInput.Prompt>
        <FileInput.Files />
      </FileInput.Root>
    </Field.Root>
  ),
};

/** A Field.Error marks the control invalid: the box takes the danger border. */
export const WithError: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Passport scan</Field.Label>
      <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
      <Field.Error>Choose a file smaller than 5 MB</Field.Error>
      <FileInput.Root>
        <FileInput.Control accept=".pdf,.png" />
        <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
        <FileInput.Files />
      </FileInput.Root>
    </Field.Root>
  ),
};

/** The state a file held over the box puts the Root in (`data-dragging`), held for the docs. */
export const Dragging: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Passport scan</Field.Label>
      <FileInput.Root data-dragging>
        <FileInput.Control accept=".pdf,.png" />
        <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
        <FileInput.Files />
      </FileInput.Root>
    </Field.Root>
  ),
};

/**
 * Interaction test: choosing a file through the native control fills the
 * Files live region with its name and size.
 */
export const AnnouncesTheChoice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/Passport scan/);
    const file = new File(["x".repeat(2048)], "passport.png", { type: "image/png" });

    await userEvent.upload(input, file);

    const list = canvas.getByRole("list");
    await expect(list).toHaveAttribute("aria-live", "polite");
    await expect(list).toHaveTextContent("passport.png");
    await expect(list).toHaveTextContent("2 kB");
  },
};
