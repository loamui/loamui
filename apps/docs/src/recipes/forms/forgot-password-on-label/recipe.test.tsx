import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("forgot-password-on-label", () => {
  it("names the box Password alone and keeps the reset link outside the label", async () => {
    const { container } = render(<Recipe />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("autocomplete", "current-password");
    const link = screen.getByRole("link", { name: "Forgot your password?" });
    expect(link).toHaveAttribute("href", "/forgot-password");
    const label = container.querySelector("label")!;
    expect(label).toHaveTextContent(/^Password$/);
    expect(label).not.toContainElement(link);
    expect(screen.getByRole("button", { name: "Show password" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
