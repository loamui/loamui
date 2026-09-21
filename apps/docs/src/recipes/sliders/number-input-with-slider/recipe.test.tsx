import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("number-input-with-slider", () => {
  it("names the box and the slider by the one label and keeps the two on the same value", async () => {
    const { container } = render(<Recipe />);
    const box = screen.getByRole("textbox", { name: "Propagator temperature" });
    const slider = screen.getByRole("slider", { name: "Propagator temperature" });
    expect(box.id).not.toBe(slider.id);
    expect(box).toHaveAttribute("size", "3");
    expect(box).toHaveValue("20");
    expect(slider).toHaveValue("20");
    expect(slider).toHaveAccessibleDescription(
      "Whole degrees between 10 and 30 °C. Invalid or fractional entries return to the last temperature when you leave the field.",
    );

    fireEvent.change(slider, { target: { value: "25" } });
    expect(box).toHaveValue("25");

    fireEvent.change(box, { target: { value: "1" } });
    expect(slider).toHaveValue("25");
    fireEvent.change(box, { target: { value: "12" } });
    expect(slider).toHaveValue("12");

    fireEvent.change(box, { target: { value: "99" } });
    fireEvent.blur(box);
    expect(box).toHaveValue("30");
    expect(slider).toHaveValue("30");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
  it.each(["", "abc", "12.5", "Infinity"])("restores the last integer for %j on blur", (value) => {
    render(<Recipe />);
    const input = screen.getByRole("textbox");
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "24" } });
    fireEvent.change(input, { target: { value } });
    fireEvent.blur(input);
    expect(input).toHaveValue("24");
    expect(slider).toHaveValue("24");
  });
});
