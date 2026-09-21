import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("floating-label", () => {
  it("names the box by a real label whose placeholder is a lone space, not the label", async () => {
    const { container } = render(<Recipe />);
    const input = screen.getByLabelText("Full name");
    expect(input.id).toBeTruthy();
    expect(input).toHaveAttribute("autocomplete", "name");
    expect(input).toHaveAttribute("placeholder", " ");
    const label = container.querySelector("label")!;
    expect(label).toHaveAttribute("for", input.id);
    expect(label).not.toHaveClass("loam-Field-label");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
