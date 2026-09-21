import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("user-button", () => {
  it("is one core Button named by the person's name and email, with the avatar and chevron hidden", async () => {
    const { container } = render(<Recipe />);
    const button = screen.getByRole("button", {
      name: "Imogen Hartley imogen@hedgerow.example",
    });
    expect(button).toHaveClass("loam-Button");
    expect(container.querySelector("div.user-button")).toContainElement(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
