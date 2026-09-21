import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("sign-up", () => {
  it("is a form named by its heading whose password field is described by its rules before it", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("form", { name: "Create an account" })).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveAttribute("autocomplete", "name");
    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("autocomplete", "new-password");
    expect(password).toHaveAttribute("minlength", "12");
    const rules = screen.getByText(/At least 12 characters/);
    expect(password.getAttribute("aria-describedby")).toBe(rules.id);
    const consent = screen.getByRole("checkbox", { name: /membership terms/ });
    expect(consent).toBeRequired();
    expect(consent).not.toBeChecked();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
