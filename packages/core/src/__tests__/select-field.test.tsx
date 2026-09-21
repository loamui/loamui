import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Field, Select } from "../index.js";

afterEach(cleanup);

describe("Select ↔ Field wiring", () => {
  it("Select inside a Field gets id/describedby/invalid from context", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Country</Field.Label>
        <Field.Description>Where you live.</Field.Description>
        <Select.Root>
          <Select.Option>UK</Select.Option>
        </Select.Root>
        <Field.Error>Select a country</Field.Error>
      </Field.Root>,
    );
    const select = screen.getByLabelText("Country");
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveAccessibleDescription(/Where you live/);
    expect(select).toHaveAttribute("aria-invalid", "true");
  });

  it("Field.Error puts the composed select in an invalid state", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Country</Field.Label>
        <Select.Root>
          <Select.Option>UK</Select.Option>
        </Select.Root>
        <Field.Error>Select a country</Field.Error>
      </Field.Root>,
    );
    const select = screen.getByLabelText("Country");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Select a country");
  });
});

describe("Select options", () => {
  it("starts on a disabled empty option when one leads the children, else on the first option", () => {
    render(
      <>
        <Select.Root aria-label="Country">
          <Select.Option value="" disabled>
            Pick a country
          </Select.Option>
          <Select.Option value="ca">Canada</Select.Option>
          <Select.Option value="uk">United Kingdom</Select.Option>
        </Select.Root>
        <Select.Root aria-label="Instrument">
          <Select.Option>Violin</Select.Option>
          <Select.Option>Cello</Select.Option>
        </Select.Root>
      </>,
    );
    const country = screen.getByLabelText("Country") as HTMLSelectElement;
    expect(country.value).toBe("");
    expect(country.selectedOptions[0]).toHaveTextContent("Pick a country");
    expect(country.selectedOptions[0]).toBeDisabled();
    const instrument = screen.getByLabelText("Instrument") as HTMLSelectElement;
    expect(instrument.value).toBe("Violin");
  });

  it("honours a defaultValue and a controlled value over the prompt", () => {
    render(
      <>
        <Select.Root aria-label="Country" defaultValue="uk">
          <Select.Option value="" disabled>
            Pick a country
          </Select.Option>
          <Select.Option value="ca">Canada</Select.Option>
          <Select.Option value="uk">United Kingdom</Select.Option>
        </Select.Root>
        <Select.Root aria-label="Controlled" value="ca" onChange={() => {}}>
          <Select.Option value="" disabled>
            Pick a country
          </Select.Option>
          <Select.Option value="ca">Canada</Select.Option>
        </Select.Root>
      </>,
    );
    expect((screen.getByLabelText("Country") as HTMLSelectElement).value).toBe("uk");
    expect((screen.getByLabelText("Controlled") as HTMLSelectElement).value).toBe("ca");
  });

  it("lands className and ref on the select and wrapperProps on the box", () => {
    let node: HTMLSelectElement | null = null;
    const { container } = render(
      <Select.Root
        aria-label="Country"
        className="mine"
        ref={(el) => {
          node = el;
        }}
        wrapperProps={{ className: "box", id: "box" }}
      >
        <Select.Option>UK</Select.Option>
      </Select.Root>,
    );
    const select = screen.getByLabelText("Country");
    expect(node).toBe(select);
    expect(select).toHaveClass("mine");
    expect(container.querySelector("#box")).toHaveClass("loam-Select-field", "box");
    expect(container.querySelector("#box")).not.toHaveAttribute("data-disabled");
  });
});
