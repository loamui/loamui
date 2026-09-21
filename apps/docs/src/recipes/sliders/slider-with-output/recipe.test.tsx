import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("slider-with-output", () => {
  it("binds a native output to the labelled range and writes the value with its unit", async () => {
    const { container } = render(<Recipe />);
    const slider = screen.getByRole("slider", { name: "Row spacing" });
    const output = screen.getByRole("status");
    expect(output.tagName).toBe("OUTPUT");
    expect(output).toHaveAttribute("for", slider.id);
    expect(output).toHaveTextContent("30 cm");

    fireEvent.change(slider, { target: { value: "45" } });
    expect(output).toHaveTextContent("45 cm");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
