import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Price } from "../../index.js";

const meta = {
  title: "Data display/Price",
  component: Price,
  tags: ["autodocs"],
  args: {
    value: 24,
    currency: "GBP",
    children: "per seat, per month",
  },
  argTypes: {
    currency: { control: "inline-radio", options: ["GBP", "USD", "EUR", "JPY"] },
    locale: { control: "inline-radio", options: ["en", "en-US", "de-DE", "fr-FR", "ja-JP"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A monetary amount on a `<data>` element. It takes the type around it " +
          "(there is no size prop), fixes the figures to lining tabular numerals, " +
          "and drops the zeros of whole amounts.",
      },
    },
  },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Whole amounts drop their zeros: £24, not £24.00. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const data = within(canvasElement).getByText(/£24/);
    await expect(data.closest("data")).toHaveAttribute("value", "24");
  },
};

/** The amount takes the font of whatever it sits in: here a 2xl paragraph. */
export const InAHeadline: Story = {
  render: (args) => (
    <p style={{ fontSize: "var(--loam-text-2xl)", fontWeight: 700, margin: 0 }}>
      <Price {...args} />
    </p>
  ),
};

/** Fractional amounts keep their pence; tabular figures keep a column straight. */
export const InAColumn: Story = {
  render: () => (
    <ul style={{ display: "grid", gap: "0.25rem", listStyle: "none", margin: 0, padding: 0 }}>
      <li>
        <Price value={9.5} currency="GBP" />
      </li>
      <li>
        <Price value={120} currency="GBP" />
      </li>
      <li>
        <Price value={1250.25} currency="GBP" />
      </li>
    </ul>
  ),
};

/** Locale decides grouping, the decimal mark and where the symbol sits. */
export const Locales: Story = {
  render: () => (
    <ul style={{ display: "grid", gap: "0.25rem", listStyle: "none", margin: 0, padding: 0 }}>
      <li>
        <Price value={1250.5} currency="EUR" locale="de-DE" />
      </li>
      <li>
        <Price value={1250.5} currency="EUR" locale="fr-FR" />
      </li>
      <li>
        <Price value={1250} currency="JPY" locale="ja-JP" />
      </li>
    </ul>
  ),
};
