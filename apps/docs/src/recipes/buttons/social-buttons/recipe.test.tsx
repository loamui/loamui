import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("social-buttons", () => {
  it("is a list of three submit buttons named for their providers, each in its own form", async () => {
    const { container } = render(<Recipe />);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    for (const [name, action] of [
      ["Continue with Google", "/auth/google"],
      ["Continue with GitHub", "/auth/github"],
      ["Continue with Apple", "/auth/apple"],
    ]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveAttribute("type", "submit");
      expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(button.closest("form")).toHaveAttribute("action", action);
      expect(button.closest("form")).toHaveAttribute("method", "post");
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
