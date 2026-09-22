import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button, VisuallyHidden } from "../../index.js";

const meta = {
  title: "Utilities/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Text for assistive technology alone: the name of an icon-only " +
          "control, the word that tells two identical buttons apart, the " +
          "label a design hides. Real text rather than an `aria-label`, so " +
          "it translates with the page and survives reader mode.",
      },
    },
  },
  args: {
    children: "Remove Climbing bean ‘Blue Lake’ seeds",
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The words are in the accessibility tree, and take no room on the screen. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText("Remove Climbing bean ‘Blue Lake’ seeds");
    // Rendered, so assistive technology reaches it...
    await expect(text).toBeInTheDocument();
    // ...but clipped to a pixel, so the eye does not.
    await expect(text.getBoundingClientRect().height).toBeLessThanOrEqual(1);
  },
};

/** The glyph is decoration; the hidden words are the button's whole name. */
export const NamesAnIconOnlyButton: Story = {
  render: (args) => (
    <Button>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3 4h10M6.5 4V2.5h3V4M4.5 4l.5 9h6l.5-9"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <VisuallyHidden {...args} />
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Remove Climbing bean ‘Blue Lake’ seeds" }),
    ).toBeInTheDocument();
  },
};

/**
 * `render` swaps the element where the slot needs a particular one: a
 * fieldset must be named by a `<legend>`, even when the design shows none.
 */
export const AsALegend: Story = {
  args: { children: "Delivery address" },
  render: (args) => (
    <fieldset>
      <VisuallyHidden render={<legend />} {...args} />
      <label htmlFor="vh-town">Town</label>
      <input id="vh-town" />
    </fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Delivery address" })).toBeInTheDocument();
  },
};
