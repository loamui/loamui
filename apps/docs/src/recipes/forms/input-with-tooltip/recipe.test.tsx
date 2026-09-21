import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("input-with-tooltip", () => {
  it("labels the box by the Field and describes the icon Button beside it by the tooltip", async () => {
    const { container } = render(<Recipe />);
    const box = screen.getByRole("textbox", { name: "Plot reference" });
    expect(box).toHaveAttribute("name", "plot");
    const hint = screen.getByRole("button", { name: "About the plot reference" });
    expect(hint).toHaveClass("loam-Button");
    expect(hint).toHaveAttribute("type", "button");
    // Beside the box in the example's row, not inside the Input's field.
    expect(screen.getByRole("textbox")).not.toContainElement(hint);
    const row = container.querySelector("div.row")!;
    expect(row).toContainElement(box);
    expect(row).toContainElement(hint);
    const tooltip = document.getElementById(hint.getAttribute("aria-describedby")!)!;
    expect(tooltip).toHaveAttribute("role", "tooltip");
    expect(tooltip).toHaveTextContent(
      "Printed on your gate tag and your membership card, like B-14.",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
