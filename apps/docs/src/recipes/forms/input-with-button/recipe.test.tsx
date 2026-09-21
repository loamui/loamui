import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("input-with-button", () => {
  it("is a form whose box is labelled by the Field and whose button submits it, named for its action", async () => {
    const { container } = render(<Recipe />);
    const form = container.querySelector("form")!;
    expect(form).toHaveClass("input-with-button");
    expect(form).toHaveAttribute("action", "/newsletter");
    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAccessibleDescription(
      "Sowing notes once a month. Unsubscribe from any issue.",
    );
    const button = screen.getByRole("button", { name: "Subscribe" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button.closest("form")).toBe(form);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
