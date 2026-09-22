import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { useState } from "react";

import { SegmentedControl } from "../components/SegmentedControl/index.js";

afterEach(cleanup);

// Colour contrast is covered live in Storybook; jsdom has no canvas for it.
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

function Range(props: {
  name?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hideLegend?: boolean;
}) {
  return (
    <SegmentedControl.Root
      name={props.name}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
    >
      <SegmentedControl.Legend className={props.hideLegend ? "loam-VisuallyHidden" : undefined}>
        Range
      </SegmentedControl.Legend>
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month" disabled>
        Month
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

describe("SegmentedControl", () => {
  it("has no axe violations, with the legend shown and hidden", async () => {
    const { container, unmount } = render(<Range defaultValue="week" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
    unmount();
    const hidden = render(<Range defaultValue="week" hideLegend />);
    expect(await axe(hidden.container, axeOptions)).toHaveNoViolations();
  });

  it("is a radiogroup named by its Legend, of native radios named by their segments", () => {
    render(<Range defaultValue="week" />);
    const group = screen.getByRole("radiogroup", { name: "Range" });
    expect(group.tagName).toBe("FIELDSET");
    const radios = screen.getAllByRole("radio");
    expect(radios.map((r) => r.getAttribute("type"))).toEqual(["radio", "radio", "radio"]);
    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Month" })).toBeDisabled();
    // One name across the group, so the browser enforces exclusivity.
    expect(new Set(radios.map((r) => r.getAttribute("name"))).size).toBe(1);
  });

  it("moves the choice with the arrow keys and reports it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Range defaultValue="day" onValueChange={onValueChange} />);
    const day = screen.getByRole("radio", { name: "Day" });
    day.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("week");
    await user.keyboard("{ArrowLeft}");
    expect(day).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("day");
  });

  it("picks a segment on click through its label", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Range defaultValue="day" onValueChange={onValueChange} />);
    await user.click(screen.getByText("Week"));
    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("week");
  });

  it("submits the chosen value under name", () => {
    const onSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
        }}
      >
        <Range name="range" defaultValue="week" />
        <button type="submit">Apply</button>
      </form>,
    );
    screen.getByRole("button", { name: "Apply" }).click();
    expect(onSubmit).toHaveBeenCalledWith({ range: "week" });
  });

  it("follows a controlled value", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("day");
      return (
        <>
          <SegmentedControl.Root value={value} onValueChange={setValue}>
            <SegmentedControl.Legend>View</SegmentedControl.Legend>
            <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
            <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          </SegmentedControl.Root>
          <p>Showing {value}</p>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByText("Week"));
    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
    expect(screen.getByText("Showing week")).toBeInTheDocument();
  });

  it("throws when a part is rendered outside the Root", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<SegmentedControl.Item value="x">X</SegmentedControl.Item>)).toThrow(
      /inside <SegmentedControl.Root>/,
    );
    expect(() => render(<SegmentedControl.Legend>X</SegmentedControl.Legend>)).toThrow(
      /inside <SegmentedControl.Root>/,
    );
    error.mockRestore();
  });

  it("names the chosen state in system colours under forced colours", () => {
    const css = readFileSync(
      resolve(__dirname, "../components/SegmentedControl/SegmentedControl.css"),
      "utf8",
    );
    const forced = css.slice(css.indexOf("@media (forced-colors: active)"));
    expect(forced).toMatch(/input:checked\)\s*{[^}]*background: Highlight/);
    expect(forced).toMatch(/input:checked\)\s*{[^}]*color: HighlightText/);
  });
});
