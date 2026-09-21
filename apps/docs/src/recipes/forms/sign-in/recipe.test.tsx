import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("sign-in", () => {
  it("is a form named by its heading, with every control labelled and autofill purposes set", async () => {
    const { container } = render(<Recipe />);
    const form = screen.getByRole("form", { name: "Sign in" });
    expect(form).toHaveAttribute("aria-labelledby", screen.getByRole("heading", { level: 1 }).id);
    expect(form).toHaveAttribute("method", "post");
    expect(screen.getByLabelText("Email address")).toHaveAttribute("autocomplete", "email");
    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAttribute("autocomplete", "current-password");
    expect(screen.getByRole("button", { name: "Show password" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("checkbox", { name: "Keep me signed in" })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Sign in" })).toHaveAttribute("type", "submit");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
