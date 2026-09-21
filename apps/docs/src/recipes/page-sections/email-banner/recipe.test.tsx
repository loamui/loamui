import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("email-banner", () => {
  it("is a region named by its h2 with a labelled email box and a submit button beside it", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "The sowing letter" })).toHaveClass("email-banner");
    const box = screen.getByLabelText("Email address");
    expect(box).toHaveAttribute("type", "email");
    expect(box).toBeRequired();
    expect(box.closest("form")).toHaveAttribute("action", "/newsletter");
    expect(screen.getByRole("button", { name: "Subscribe" })).toHaveAttribute("type", "submit");
    expect(container.querySelector("svg.illustration")).toHaveAttribute("aria-hidden", "true");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
