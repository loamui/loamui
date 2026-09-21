import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("banner-warning", () => {
  it("says its status in hidden words and hides the glyph that shows it", async () => {
    const { container } = render(<Recipe />);
    const message = container.querySelector("p");
    expect(message).toHaveTextContent(/^Warning: Postal strikes/);
    expect(screen.getByText("Warning:")).toHaveClass("loam-VisuallyHidden");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "Track your order" })).toHaveAttribute(
      "href",
      "/orders",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
