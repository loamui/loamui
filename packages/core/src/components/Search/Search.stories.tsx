import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import type { FormEvent } from "react";
import { Field } from "../../index.js";
import { Search } from "./index.js";

const meta = {
  title: "Inputs/Search",
  component: Search.Root,
  tags: ["autodocs"],
  args: {
    "aria-label": "Search",
    // The demo form must not navigate the Storybook frame; the mock
    // records the native submit that Enter or the button raised.
    onSubmit: fn((event: FormEvent<HTMLFormElement>) => event.preventDefault()),
  },
  parameters: {
    docs: {
      description: {
        component:
          "The site's or page's search: a native `<search>` landmark around a " +
          'native form, with the library\'s Input as a `type="search"` box and ' +
          "its Button as the submit. Search.Label names the box without showing " +
          "the name; a Field around the box names it visibly instead. There is " +
          "no size prop — the row fills its container.",
      },
    },
  },
} satisfies Meta<typeof Search.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The label is read, not seen; Enter in the box submits the form. */
export const Default: Story = {
  render: (args) => (
    <Search.Root {...args}>
      <Search.Label>Search this site</Search.Label>
      <Search.Input />
      <Search.Button />
    </Search.Root>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("searchbox", { name: "Search this site" });
    await userEvent.type(box, "tokens{Enter}");
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await expect(canvas.getByLabelText("Search", { selector: "search" })).toContainElement(box);
  },
};

/** An icon with an aria-label makes the button icon-only; the name is still read. */
export const IconButton: Story = {
  render: (args) => (
    <Search.Root {...args}>
      <Search.Label>Search this site</Search.Label>
      <Search.Input />
      <Search.Button aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </Search.Button>
    </Search.Root>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Search" });
    await expect(button).toHaveAttribute("type", "submit");
  },
};

/** A Field around the box names it visibly; the box wires itself to the Field. */
export const InAField: Story = {
  args: { "aria-label": "Search orders" },
  render: (args) => (
    <Search.Root {...args}>
      <Field.Root>
        <Field.Label>Order number</Field.Label>
        <Field.Description>The reference on your confirmation email.</Field.Description>
        <Search.Input name="order" />
      </Field.Root>
      <Search.Button>Find order</Search.Button>
    </Search.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("searchbox", { name: "Order number" });
    await expect(box).toHaveAccessibleDescription("The reference on your confirmation email.");
    await expect(canvas.getByLabelText("Search orders", { selector: "search" })).toContainElement(
      box,
    );
  },
};
