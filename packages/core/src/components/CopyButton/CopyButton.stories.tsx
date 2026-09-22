import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CopyButton } from "../../index.js";

const meta = {
  title: "Inputs/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  args: { value: "pnpm add @loamui/core" },
  parameters: {
    docs: {
      description: {
        component:
          "A Button that copies a string to the clipboard and says so: the " +
          "label reads `labels.copied` for `timeout` ms and a visually hidden " +
          "status region announces it. A refused clipboard is announced too, " +
          "and the label is left alone.",
      },
    },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Copy an install command; the label reverts after 1.5s. */
export const Default: Story = {};

/**
 * An svg child is detected by Button as an icon; the `aria-label` names the
 * button and makes it square. The copied label still shows briefly, so a
 * sighted user sees the confirmation too.
 */
export const IconOnly: Story = {
  args: { "aria-label": "Copy install command" },
  render: (args) => (
    <CopyButton {...args}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </CopyButton>
  ),
};

/** Every word is yours: the rest label, the copied label and the failure. */
export const CustomLabels: Story = {
  args: {
    value: "https://loamui.dev/docs/components/copy-button",
    children: "Copy link",
    labels: {
      copied: "Link copied",
      failed: "The link could not be copied: select it and copy it yourself",
    },
    timeout: 3000,
  },
};

/**
 * Clicking copies the value and the label reads "Copied". The clipboard is
 * stubbed for the test: a browser refuses `writeText` without a real user
 * gesture, and the story should not write to the clipboard of whoever runs it.
 */
export const AnnouncesCopied: Story = {
  play: async ({ canvasElement }) => {
    const written: string[] = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text: string) => void written.push(text) },
    });
    try {
      const canvas = within(canvasElement);
      await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
      await expect(canvas.getByRole("button", { name: "Copied" })).toBeInTheDocument();
      await expect(canvas.getByRole("status")).toHaveTextContent("Copied");
      await expect(written).toEqual(["pnpm add @loamui/core"]);
    } finally {
      // Back to the platform's own getter on Navigator.prototype.
      Reflect.deleteProperty(navigator, "clipboard");
    }
  },
};
