import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button, Combobox, Field } from "../../index.js";

const COUNTRIES = [
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Ireland",
  "Italy",
  "Japan",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Portugal",
  "Spain",
  "Sweden",
  "United Kingdom",
];

function matches(query: string, from: string[] = COUNTRIES): string[] {
  const q = query.trim().toLowerCase();
  return from.filter((c) => c.toLowerCase().includes(q));
}

/** The consumer filters; the component manages the rest. */
function CountryCombobox(props: { trigger?: boolean; name?: string }) {
  const [query, setQuery] = useState("");
  return (
    <Combobox.Root inputValue={query} onInputValueChange={setQuery} name={props.name}>
      <Combobox.Input />
      {props.trigger && <Combobox.Trigger />}
      <Combobox.List>
        {matches(query).map((c) => (
          <Combobox.Option key={c} value={c}>
            {c}
          </Combobox.Option>
        ))}
        <Combobox.Empty />
      </Combobox.List>
    </Combobox.Root>
  );
}

const meta = {
  title: "Inputs/Combobox",
  component: Combobox.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A text box with a list of suggestions under it, composed from parts " +
          "(Root, Input, Trigger, List, Option, Empty): the APG editable combobox " +
          "with a listbox popup. The Input is the library's Input, so a Field names " +
          "it; which Options appear is the consumer's filter, and the component " +
          "manages the highlight, the selection, the open state and a live count.",
      },
    },
  },
  render: () => (
    <div style={{ maxInlineSize: "20rem" }}>
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <CountryCombobox />
      </Field.Root>
    </div>
  ),
} satisfies Meta<typeof Combobox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Typing opens the list; the consumer renders the Options that match the
 * text. ArrowDown and ArrowUp move the highlight, Enter chooses, Escape
 * closes the list and, pressed again, clears the box.
 */
export const Default: Story = {};

/**
 * A Trigger beside the box opens the list for pointer users; it is out of
 * the Tab sequence because the box already reaches the list by keyboard.
 */
export const WithTrigger: Story = {
  render: () => (
    <div style={{ maxInlineSize: "20rem" }}>
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <CountryCombobox trigger />
      </Field.Root>
    </div>
  ),
};

/**
 * A disabled Option stays in the list (the user learns it exists) but the
 * keyboard skips it and a click does nothing.
 */
export const DisabledOptions: Story = {
  render: function DisabledOptionsStory() {
    const [query, setQuery] = useState("");
    const plans = ["Free", "Team", "Business", "Enterprise"];
    return (
      <div style={{ maxInlineSize: "20rem" }}>
        <Field.Root>
          <Field.Label>Plan</Field.Label>
          <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
            <Combobox.Input />
            <Combobox.Trigger />
            <Combobox.List>
              {matches(query, plans).map((p) => (
                <Combobox.Option key={p} value={p.toLowerCase()} disabled={p === "Enterprise"}>
                  {p}
                </Combobox.Option>
              ))}
              <Combobox.Empty />
            </Combobox.List>
          </Combobox.Root>
        </Field.Root>
      </div>
    );
  },
};

/**
 * Inside a Field the box is named, described and marked invalid the way
 * every control is: Field.Error's presence is the error state.
 */
export const InAField: Story = {
  render: () => (
    <div style={{ maxInlineSize: "20rem" }}>
      <Field.Root invalid>
        <Field.Label>Country</Field.Label>
        <Field.Description>Where you are resident for tax.</Field.Description>
        <Field.Error>Choose a country from the list</Field.Error>
        <CountryCombobox />
      </Field.Root>
    </div>
  ),
};

/**
 * `name` on the Root submits the chosen option's value as a hidden input,
 * so the form works like one with a native select.
 */
export const InAForm: Story = {
  render: function InAFormStory() {
    const [submitted, setSubmitted] = useState<string | null>(null);
    return (
      <form
        style={{ display: "grid", gap: "var(--loam-space-xs)", maxInlineSize: "20rem" }}
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(String(new FormData(e.currentTarget).get("country") ?? ""));
        }}
      >
        <Field.Root>
          <Field.Label>Country</Field.Label>
          <CountryCombobox name="country" />
        </Field.Root>
        <Button type="submit">Save</Button>
        {submitted !== null && (
          <p role="status" style={{ margin: 0 }}>
            Submitted: {submitted || "nothing"}
          </p>
        )}
      </form>
    );
  },
};

/**
 * Interaction test: typing filters and opens, ArrowDown highlights,
 * Enter commits the option's label into the box and closes the list.
 */
export const TypesHighlightsAndCommits: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("combobox", { name: "Country" });

    await userEvent.type(box, "ne");
    await expect(box).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getAllByRole("option")).toHaveLength(2);

    await userEvent.keyboard("{ArrowDown}");
    const first = canvas.getByRole("option", { name: "Netherlands" });
    await expect(box).toHaveAttribute("aria-activedescendant", first.id);

    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(box).toHaveValue("New Zealand");
    await expect(box).toHaveAttribute("aria-expanded", "false");
  },
};
