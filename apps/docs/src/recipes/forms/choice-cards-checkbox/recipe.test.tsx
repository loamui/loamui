import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("choice-cards-checkbox", () => {
  it("is a named group of cards, each a label around a checkbox named by its title and described by its detail", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("group", { name: "Add-ons" })).toHaveClass("choice-cards-checkbox");
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(3);
    for (const box of boxes) expect(box).toHaveAttribute("name", "addon");
    const seed = screen.getByRole("checkbox", { name: "Seed of the month" });
    expect(seed).toBeChecked();
    expect(seed).toHaveAccessibleDescription(/£4 a month/);
    expect(seed.closest("label")).toHaveAttribute("for", seed.id);
    const pass = screen.getByRole("checkbox", { name: "Open-day pass" });
    expect(pass).toBeDisabled();
    expect(pass).toHaveAccessibleDescription(/Included with Grower/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
