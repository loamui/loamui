import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import type { FormEvent } from "react";

import { Combobox } from "../components/Combobox/index.js";
import { Field } from "../index.js";

afterEach(cleanup);

// Colour contrast is covered live in Storybook; jsdom has no canvas for it.
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

const FRUITS = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry"];

function Fruits(props: {
  name?: string;
  defaultValue?: string;
  disabled?: string[];
  trigger?: boolean;
  onValueChange?: (value: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const matches = FRUITS.filter((f) => f.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Field.Root>
      <Field.Label>Fruit</Field.Label>
      <Field.Description>Start typing to see suggestions.</Field.Description>
      <Combobox.Root
        name={props.name}
        defaultValue={props.defaultValue}
        inputValue={query}
        onInputValueChange={setQuery}
        onValueChange={props.onValueChange}
      >
        <Combobox.Input />
        {props.trigger && <Combobox.Trigger />}
        <Combobox.List>
          {matches.map((f) => (
            <Combobox.Option key={f} value={f.toLowerCase()} disabled={props.disabled?.includes(f)}>
              {f}
            </Combobox.Option>
          ))}
          <Combobox.Empty />
        </Combobox.List>
      </Combobox.Root>
    </Field.Root>
  );
}

describe("Combobox", () => {
  it("has no axe violations, closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Fruits trigger />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
    await user.type(screen.getByRole("combobox"), "a");
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("has no axe violations with an empty list", async () => {
    const user = userEvent.setup();
    const { container } = render(<Fruits />);
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getByText("No results")).toBeVisible();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("is named and described by the Field around it", () => {
    render(<Fruits />);
    const box = screen.getByRole("combobox", { name: "Fruit" });
    expect(box.tagName).toBe("INPUT");
    expect(box).toHaveAccessibleDescription("Start typing to see suggestions.");
    expect(box).toHaveAttribute("aria-autocomplete", "list");
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(box).toHaveAttribute("aria-controls", screen.getByRole("listbox", { hidden: true }).id);
  });

  it("opens on typing, filters through the consumer, and announces the count", async () => {
    const user = userEvent.setup();
    render(<Fruits />);
    const box = screen.getByRole("combobox");
    expect(screen.getByRole("status")).toHaveTextContent("");

    await user.type(box, "ap");
    expect(box).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Apple", "Apricot"]);
    expect(screen.getByRole("status")).toHaveTextContent("2 results available");
  });

  it("announces the settled count on the commit the options mount in, never a stale one", async () => {
    const user = userEvent.setup();
    const status = vi.fn((n: number) => `${n} results available`);
    // Options that exist only once there is text: they mount in the same
    // commit that opens the list, when the registered count is still 0.
    function Lazy() {
      const [query, setQuery] = useState("");
      const matches = query
        ? FRUITS.filter((f) => f.toLowerCase().includes(query.toLowerCase()))
        : [];
      return (
        <Combobox.Root inputValue={query} onInputValueChange={setQuery} labels={{ status }}>
          <Combobox.Input aria-label="Fruit" />
          <Combobox.List>
            {matches.map((f) => (
              <Combobox.Option key={f} value={f}>
                {f}
              </Combobox.Option>
            ))}
            <Combobox.Empty />
          </Combobox.List>
        </Combobox.Root>
      );
    }
    render(<Lazy />);
    expect(status).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("");

    // A click opens the still-empty list: zero is the real count here.
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("status")).toHaveTextContent("0 results available");
    status.mockClear();

    await user.keyboard("b");
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent("2 results available");
    expect(status.mock.calls.map(([n]) => n)).toEqual(Array(status.mock.calls.length).fill(2));

    status.mockClear();
    await user.keyboard("l");
    expect(screen.getByRole("status")).toHaveTextContent("1 results available");
    expect(status.mock.calls.map(([n]) => n)).toEqual(Array(status.mock.calls.length).fill(1));
  });

  it("commits the highlighted option with ArrowDown + Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fruits name="fruit" onValueChange={onValueChange} />);
    const box = screen.getByRole("combobox");

    await user.type(box, "b");
    await user.keyboard("{ArrowDown}");
    const banana = screen.getByRole("option", { name: "Banana" });
    expect(banana).toHaveAttribute("data-highlighted", "true");
    expect(box).toHaveAttribute("aria-activedescendant", banana.id);

    await user.keyboard("{ArrowDown}");
    const blueberry = screen.getByRole("option", { name: "Blueberry" });
    expect(box).toHaveAttribute("aria-activedescendant", blueberry.id);

    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("blueberry");
    expect(box).toHaveValue("Blueberry");
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(box).not.toHaveAttribute("aria-activedescendant");
    expect(box).toHaveFocus();
  });

  it("jumps to the ends of the open list with Home and End, and leaves the caret alone when closed", async () => {
    const user = userEvent.setup();
    render(<Fruits />);
    const box = screen.getByRole("combobox");

    await user.type(box, "a");
    await user.keyboard("{End}");
    expect(box).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Banana" }).id,
    );
    await user.keyboard("{Home}");
    expect(box).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Apple" }).id,
    );

    await user.keyboard("{Escape}");
    expect(box).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{Home}");
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(box).not.toHaveAttribute("aria-activedescendant");
  });

  it("skips disabled options and never commits one", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fruits disabled={["Apricot"]} onValueChange={onValueChange} />);
    const box = screen.getByRole("combobox");

    await user.type(box, "ap");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(box).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Apple" }).id,
    );

    await user.click(screen.getByRole("option", { name: "Apricot" }));
    expect(onValueChange).not.toHaveBeenCalledWith("apricot");
    expect(box).toHaveAttribute("aria-expanded", "true");
  });

  it("commits on click, keeping focus in the box", async () => {
    const user = userEvent.setup();
    render(<Fruits />);
    const box = screen.getByRole("combobox");
    await user.type(box, "ch");
    await user.click(screen.getByRole("option", { name: "Cherry" }));
    expect(box).toHaveValue("Cherry");
    expect(box).toHaveFocus();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes on Escape, then clears on a second Escape", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fruits onValueChange={onValueChange} />);
    const box = screen.getByRole("combobox");

    await user.type(box, "ch");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(box).toHaveValue("Cherry");

    await user.keyboard("{ArrowDown}");
    expect(box).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(box).toHaveValue("Cherry");

    await user.keyboard("{Escape}");
    expect(box).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("closes when focus leaves and on a click outside", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Fruits />
        <button type="button">Elsewhere</button>
      </>,
    );
    const box = screen.getByRole("combobox");

    await user.type(box, "a");
    await user.tab();
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Elsewhere" })).toHaveFocus();

    await user.click(box);
    expect(box).toHaveAttribute("aria-expanded", "true");
    await user.click(document.body);
    expect(box).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles the list from the Trigger without leaving the box", async () => {
    const user = userEvent.setup();
    render(<Fruits trigger />);
    const box = screen.getByRole("combobox");
    const trigger = screen.getByRole("button", { name: "Show options" });
    expect(trigger).toHaveAttribute("tabindex", "-1");

    await user.click(trigger);
    expect(box).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(box).toHaveFocus();
    expect(screen.getAllByRole("option")).toHaveLength(FRUITS.length);

    await user.click(trigger);
    expect(box).toHaveAttribute("aria-expanded", "false");
  });

  it("lets children name the Trigger in place of labels.toggle", () => {
    render(
      <Combobox.Root>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Trigger>Browse</Combobox.Trigger>
        <Combobox.List />
      </Combobox.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Browse" });
    expect(trigger).not.toHaveAttribute("aria-label");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("submits the committed value under name", async () => {
    const user = userEvent.setup();
    let submitted: FormData | null = null;
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submitted = new FormData(e.currentTarget);
    };
    render(
      <form onSubmit={onSubmit}>
        <Fruits name="fruit" />
        <button type="submit">Save</button>
      </form>,
    );

    await user.type(screen.getByRole("combobox"), "ban");
    await user.keyboard("{ArrowDown}{Enter}");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(submitted!.get("fruit")).toBe("banana");
  });

  it("shows a defaultValue's label in the box", () => {
    render(<Fruits defaultValue="cherry" />);
    expect(screen.getByRole("combobox")).toHaveValue("Cherry");
    expect(screen.getByRole("option", { name: "Cherry", hidden: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("replaces the default strings through labels", async () => {
    const user = userEvent.setup();
    render(
      <Combobox.Root
        labels={{
          status: (n) => `${n} villes`,
          empty: "Aucune ville",
          toggle: "Afficher les villes",
        }}
      >
        <Combobox.Input aria-label="Ville" />
        <Combobox.Trigger />
        <Combobox.List>
          <Combobox.Empty />
        </Combobox.List>
      </Combobox.Root>,
    );
    expect(screen.getByRole("button", { name: "Afficher les villes" })).toBeInTheDocument();
    await user.type(screen.getByRole("combobox"), "x");
    expect(screen.getByText("Aucune ville")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("0 villes");
  });
});

describe("Combobox composition", () => {
  it.each(["part", "render"] as const)("uses the %s ID for the active option", async (source) => {
    render(
      <Combobox.Root>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.List>
          <Combobox.Option
            id={source === "part" ? "custom-option" : "part-option"}
            render={source === "render" ? <li id="custom-option" /> : undefined}
            value="apple"
          >
            Apple
          </Combobox.Option>
        </Combobox.List>
      </Combobox.Root>,
    );
    const user = userEvent.setup();
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", "custom-option");
    expect(screen.getByRole("option")).toHaveAttribute("id", "custom-option");
    expect(screen.getByRole("option")).toHaveAttribute("data-highlighted", "true");
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("Apple");
  });

  it("commits the current label when the rendered option element changes", async () => {
    function Example({ custom }: { custom: boolean }) {
      return (
        <Combobox.Root>
          <Combobox.Input aria-label="Fruit" />
          <Combobox.List>
            <Combobox.Option value="apple" render={custom ? <div /> : undefined}>
              {custom ? "Green apple" : "Apple"}
            </Combobox.Option>
          </Combobox.List>
        </Combobox.Root>
      );
    }
    const { rerender } = render(<Example custom={false} />);
    rerender(<Example custom />);
    const user = userEvent.setup();
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(input).toHaveValue("Green apple");
  });
});
