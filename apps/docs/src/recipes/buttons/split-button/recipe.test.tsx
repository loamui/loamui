import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("split-button", () => {
  it("is one form whose main button submits and whose chevron opens a menu of submit buttons", async () => {
    const { container } = render(<Recipe />);
    const form = container.querySelector("form")!;
    expect(form).toHaveClass("split-button");
    expect(form).toHaveAttribute("action", "/basket");
    const main = screen.getByRole("button", { name: "Add to basket" });
    expect(main).toHaveAttribute("type", "submit");
    const more = screen.getByRole("button", { name: "More ways to add" });
    expect(more).toHaveAttribute("aria-haspopup", "menu");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(more);
    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Add and go to basket",
      "Save for later",
      "Add to a wish list",
    ]);
    for (const item of items) {
      expect(item).toHaveAttribute("type", "submit");
      expect(item).toHaveAttribute("name", "then");
      expect(item.closest("form")).toBe(form);
    }
    await waitFor(() => expect(items[0]).toHaveFocus());
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
