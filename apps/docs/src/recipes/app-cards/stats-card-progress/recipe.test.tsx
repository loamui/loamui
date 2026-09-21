import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("stats-card-progress", () => {
  it("is a Card region with a large progress bar named by its label, speaking its value in words", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Orders packed" })).toHaveClass("loam-Card");
    const bar = screen.getByRole("progressbar", { name: "Packed so far" });
    expect(bar).toHaveAttribute("value", "70");
    expect(bar).toHaveAttribute("aria-valuetext", "70% packed");
    expect(bar.closest(".loam-Progress")).toHaveAttribute("data-size", "lg");
    expect(container.querySelector("p.value")).toHaveTextContent("1,120 of 1,600 orders");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
