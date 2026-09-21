import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("number-with-currency", () => {
  it("labels the amount by the Field and the currency by its own name, and swaps the symbol with the choice", async () => {
    const { container } = render(<Recipe />);
    const amount = screen.getByRole("textbox", { name: "Amount" });
    expect(amount).toHaveAttribute("inputmode", "decimal");
    expect(amount).toHaveAccessibleDescription(
      "Gift cards are sold in three currencies, from 10 to 200.",
    );
    const currency = screen.getByRole("combobox", { name: "Currency" });
    expect(currency).toHaveValue("GBP");
    expect(currency.id).not.toBe(amount.id);
    expect(container.querySelector("label")).toHaveAttribute("for", amount.id);
    expect(container.querySelector(".amount")).toHaveTextContent("£");

    fireEvent.change(currency, { target: { value: "EUR" } });
    expect(container.querySelector(".amount")).toHaveTextContent("€");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
