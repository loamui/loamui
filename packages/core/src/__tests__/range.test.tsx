import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, act, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { useState } from "react";

import { Field } from "../components/Field/index.js";
import { Range } from "../components/Range/index.js";

afterEach(cleanup);

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("Range marks", () => {
  it("forwards the marks to a datalist the input references", () => {
    const { container } = render(
      <Range.Control
        aria-label="Volume"
        marks={[{ value: 0, label: "Quiet" }, { value: 50 }, { value: 100, label: "Loud" }]}
      />,
    );
    const input = screen.getByRole("slider", { name: "Volume" });
    const list = container.querySelector("datalist");
    expect(list).not.toBeNull();
    expect(input).toHaveAttribute("list", list!.id);
    const options = Array.from(list!.querySelectorAll("option"));
    expect(options.map((o) => o.value)).toEqual(["0", "50", "100"]);
    expect(options.map((o) => o.textContent)).toEqual(["Quiet", "50", "Loud"]);
  });

  it("draws the labels beside their ticks, hidden from assistive technology", () => {
    const { container } = render(
      <Range.Control
        aria-label="Volume"
        min={0}
        max={200}
        marks={[{ value: 0, label: "Quiet" }, { value: 50 }, { value: 200, label: "Loud" }]}
      />,
    );
    const marks = container.querySelector(".loam-Range-marks")!;
    expect(marks).toHaveAttribute("aria-hidden", "true");
    const spans = Array.from(marks.querySelectorAll("span"));
    expect(spans.map((s) => s.style.getPropertyValue("--_at"))).toEqual(["0", "0.25", "1"]);
    expect(spans.map((s) => s.textContent)).toEqual(["Quiet", "", "Loud"]);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("renders the bare input, and nothing else, without marks", () => {
    const { container } = render(<Range.Control aria-label="Volume" defaultValue={30} />);
    expect(container.children).toHaveLength(1);
    expect(container.querySelector("datalist")).toBeNull();
  });

  // jsdom cannot match :dir() or lay anything out, so the geometry contract
  // is checked in the stylesheet: one public thumb size read by all three
  // scopes, and a centring shift that reverses with the writing direction.
  it("places marks and output on one thumb size, mirrored for right-to-left", () => {
    const css = readFileSync(resolve(__dirname, "../components/Range/Range.css"), "utf8");
    const thumb =
      /--_thumb: var\(--loam-range-thumb-size, calc\(1\.25 \* var\(--loam-text-sm\)\)\)/g;
    expect(css.match(thumb)).toHaveLength(3);
    const marks = css.slice(css.indexOf("@scope (.loam-Range-marks)"));
    expect(marks).toMatch(/span\s*{[^}]*translate: -50%;[^}]*&:dir\(rtl\)\s*{\s*translate: 50%;/);
    const output = css.slice(css.indexOf("@scope (.loam-Range-output)"));
    expect(output).toMatch(/translate: -50%;[^}]*&:dir\(rtl\)\s*{\s*translate: 50%;/);
  });
});

describe("Range.Output", () => {
  it("is a native output bound to the input, showing its value", () => {
    render(
      <Range.Root>
        <Range.Control aria-label="Volume" defaultValue={40} />
        <Range.Output />
      </Range.Root>,
    );
    const input = screen.getByRole("slider", { name: "Volume" });
    const output = screen.getByRole("status");
    expect(output.tagName).toBe("OUTPUT");
    expect(output).toHaveAttribute("for", input.id);
    expect(output).toHaveTextContent("40");
  });

  it("follows the thumb and sets the root's --_value", () => {
    const { container } = render(
      <Range.Root>
        <Range.Control aria-label="Volume" min={0} max={200} defaultValue={50} />
        <Range.Output />
      </Range.Root>,
    );
    const root = container.querySelector<HTMLElement>(".loam-Range-root")!;
    expect(root.style.getPropertyValue("--_value")).toBe("0.25");
    fireEvent.change(screen.getByRole("slider"), { target: { value: "150" } });
    expect(screen.getByRole("status")).toHaveTextContent("150");
    expect(root.style.getPropertyValue("--_value")).toBe("0.75");
  });

  it("follows a controlled value", () => {
    function Demo() {
      const [value, setValue] = useState(10);
      return (
        <>
          <button type="button" onClick={() => setValue(90)}>
            Louder
          </button>
          <Range.Root>
            <Range.Control
              aria-label="Volume"
              value={value}
              onChange={(e) => setValue(e.target.valueAsNumber)}
            />
            <Range.Output />
          </Range.Root>
        </>
      );
    }
    render(<Demo />);
    expect(screen.getByRole("status")).toHaveTextContent("10");
    act(() => screen.getByRole("button", { name: "Louder" }).click());
    expect(screen.getByRole("status")).toHaveTextContent("90");
  });

  it("takes the field's id and its words from the consumer", () => {
    render(
      <Field.Root id="volume">
        <Field.Label>Volume</Field.Label>
        <Range.Root>
          <Range.Control defaultValue={7} />
          <Range.Output labels={{ value: (n) => `${n} dB` }} />
        </Range.Root>
      </Field.Root>,
    );
    const input = screen.getByRole("slider", { name: "Volume" });
    expect(input.id).toBe("volume");
    const output = screen.getByRole("status");
    expect(output).toHaveAttribute("for", "volume");
    expect(output).toHaveTextContent("7 dB");
  });

  it("refuses to render outside Range.Root", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Range.Output />)).toThrow(/inside <Range.Root>/);
    error.mockRestore();
  });

  it("has no axe violations with marks and an output inside a Field", async () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Volume</Field.Label>
        <Range.Root>
          <Range.Control
            defaultValue={40}
            marks={[{ value: 0, label: "Quiet" }, { value: 50 }, { value: 100, label: "Loud" }]}
          />
          <Range.Output />
        </Range.Root>
      </Field.Root>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
