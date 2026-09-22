import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Time } from "./Time.js";

const list = { display: "grid", gap: "0.25rem", listStyle: "none", margin: 0, padding: 0 };

const meta = {
  title: "Data display/Time",
  component: Time,
  tags: ["autodocs"],
  args: {
    value: "2026-08-12",
    locale: "en-GB",
  },
  argTypes: {
    dateStyle: { control: "inline-radio", options: ["short", "medium", "long", "full"] },
    timeStyle: { control: "inline-radio", options: ["short", "medium", "long", "full"] },
    locale: { control: "inline-radio", options: ["en", "en-GB", "de-DE", "fr-FR", "ja-JP"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A date or time on a `<time>` element whose `dateTime` is always the ISO " +
          "form. It takes the type around it (there is no size prop), fixes the " +
          "figures to lining tabular numerals, and writes the date the way the " +
          "locale does. Given a `relative` reference it writes the distance instead.",
      },
    },
  },
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The text is for people; the `dateTime` attribute keeps the ISO string as written. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const time = within(canvasElement).getByText("12 Aug 2026");
    await expect(time).toHaveAttribute("datetime", "2026-08-12");
  },
};

/** dateStyle decides how much of the date is written, from numerals to the weekday. */
export const Styles: Story = {
  render: (args) => (
    <ul style={list}>
      <li>
        <Time {...args} dateStyle="short" />
      </li>
      <li>
        <Time {...args} dateStyle="medium" />
      </li>
      <li>
        <Time {...args} dateStyle="long" />
      </li>
      <li>
        <Time {...args} dateStyle="full" />
      </li>
    </ul>
  ),
};

/** Add timeStyle to write the time as well; the value is then a moment, not a day. */
export const WithTime: Story = {
  args: {
    value: "2026-08-12T14:30:00Z",
    dateStyle: "medium",
    timeStyle: "short",
  },
};

/** The distance from a fixed reference, in the largest unit that fits; never the clock. */
export const Relative: Story = {
  render: (args) => (
    <ul style={list}>
      <li>
        <Time {...args} value="2026-08-12T08:30:00Z" relative={{ now: "2026-08-12T10:30:00Z" }} />
      </li>
      <li>
        <Time {...args} value="2026-08-09" relative={{ now: "2026-08-12T10:30:00Z" }} />
      </li>
      <li>
        <Time {...args} value="2026-09-12" relative={{ now: "2026-08-12T10:30:00Z" }} />
      </li>
    </ul>
  ),
};

/** Children replace the written form; the machine-readable dateTime stays. */
export const Overridden: Story = {
  args: {
    value: "2026-08-11",
    children: "Yesterday",
  },
};
