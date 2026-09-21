import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("cart-line", () => {
  it("is an article named by the product, with the quantity and the remove button named for it too", async () => {
    const { container } = render(<Recipe />);
    const article = screen.getByRole("article", { name: "Climbing bean ‘Blue Lake’ seeds" });
    expect(article).toHaveClass("cart-line");
    const quantity = screen.getByRole("spinbutton", {
      name: "Quantity of Climbing bean ‘Blue Lake’ seeds",
    });
    expect(quantity).toHaveValue(2);
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(quantity).toHaveValue(3);
    expect(
      screen.getByRole("button", { name: "Remove Climbing bean ‘Blue Lake’ seeds" }),
    ).toHaveTextContent(/^Remove/);
    expect(container.querySelector("p.total data")).toHaveTextContent("£8.40");
    const each = container.querySelector("p.each data")!;
    expect(each).toHaveAttribute("value", "2.8");
    expect(each.querySelector("small.per")).toHaveTextContent("each");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
  it("updates its total, rejects invalid quantities and supports removal with focusable undo", () => {
    const { container } = render(<Recipe />);
    const quantity = screen.getByRole("spinbutton");
    fireEvent.change(quantity, { target: { value: "5" } });
    expect(container.querySelector("p.total")).toHaveTextContent("£14");
    for (const value of ["", "0", "11", "2.5"]) {
      fireEvent.change(quantity, { target: { value } });
      fireEvent.blur(quantity);
      expect(quantity).toHaveAttribute("aria-invalid", "true");
      expect(container.querySelector("p.total data")).toBeNull();
    }
    fireEvent.change(quantity, { target: { value: "3" } });
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^Remove/ }));
    expect(screen.queryByRole("article")).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("removed");
    const undo = screen.getByRole("button", { name: "Undo removal" });
    expect(undo).toHaveFocus();
    fireEvent.click(undo);
    expect(screen.getByRole("spinbutton")).toHaveValue(3);
    expect(screen.getByRole("spinbutton")).toHaveFocus();
    expect(container.querySelector("p.total")).toHaveTextContent("£8.40");
  });
});
