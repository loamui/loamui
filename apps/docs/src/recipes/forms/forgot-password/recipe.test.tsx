import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("forgot-password", () => {
  it("is a form named by its heading with one labelled email field and a way back", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("form", { name: "Forgot your password?" })).toBeInTheDocument();
    const email = screen.getByLabelText("Email address");
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("autocomplete", "email");
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Send reset link" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByRole("link", { name: "Back to sign in" })).toHaveAttribute(
      "href",
      "/sign-in",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
