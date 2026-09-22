import { describe, it, expect, afterEach, vi } from "vitest";
import { useState } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { QuantityInput } from "../components/QuantityInput/index.js";
import { Field } from "../index.js";

afterEach(cleanup);

describe("QuantityInput", () => {
  it("takes the label's name inside a Field", () => {
    render(
      <Field.Root>
        <Field.Label>Quantity</Field.Label>
        <QuantityInput defaultValue={1} />
      </Field.Root>,
    );
    const input = screen.getByLabelText("Quantity") as HTMLInputElement;
    expect(input.type).toBe("number");
    expect(input.value).toBe("1");
  });

  it("increments on More and calls onChange with the new value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityInput aria-label="Quantity" defaultValue={1} onChange={onChange} />);
    const input = screen.getByLabelText("Quantity") as HTMLInputElement;

    await user.click(screen.getByRole("button", { name: "More" }));
    expect(input.value).toBe("2");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: input }));
  });

  it("disables Fewer at min and enables it once the count rises", async () => {
    const user = userEvent.setup();
    render(<QuantityInput aria-label="Quantity" defaultValue={0} />);
    const fewer = screen.getByRole("button", { name: "Fewer" });
    expect(fewer).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "More" }));
    expect(fewer).toBeEnabled();

    await user.click(fewer);
    expect((screen.getByLabelText("Quantity") as HTMLInputElement).value).toBe("0");
    expect(fewer).toBeDisabled();
  });

  it("disables More at max and leaves a typed overflow to constraint validation", async () => {
    const user = userEvent.setup();
    render(<QuantityInput aria-label="Quantity" defaultValue={5} max={5} />);
    const input = screen.getByLabelText("Quantity") as HTMLInputElement;
    expect(screen.getByRole("button", { name: "More" })).toBeDisabled();

    await user.clear(input);
    await user.type(input, "7");
    expect(input.value).toBe("7");
    expect(input.validity.rangeOverflow).toBe(true);
    // Typing never opens the error state on its own; that waits for a
    // submit attempt, as it does for Input.
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("steps a controlled value through onChange", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [n, setN] = useState(2);
      return (
        <QuantityInput
          aria-label="Guests"
          value={n}
          min={1}
          max={3}
          onChange={(e) => setN(e.target.valueAsNumber)}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByLabelText("Guests") as HTMLInputElement;

    await user.click(screen.getByRole("button", { name: "More" }));
    expect(input.value).toBe("3");
    expect(screen.getByRole("button", { name: "More" })).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Quantity</Field.Label>
        <Field.Description>Between 1 and 5.</Field.Description>
        <QuantityInput defaultValue={1} min={1} max={5} />
      </Field.Root>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
