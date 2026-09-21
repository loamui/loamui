import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("order-summary", () => {
  it("is a region named by its heading whose amounts are machine-readable and whose total is a named row", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Your order" });
    expect(region).toHaveClass("order-summary");
    const total = region.querySelector("div.row.total");
    expect(total?.querySelector("dt")).toHaveTextContent("Total");
    const amount = total?.querySelector("dd.value data");
    expect(amount).toHaveAttribute("value", "45.84");
    expect(amount).toHaveTextContent("£45.84");
    expect(screen.getByText("-£4.65")).toHaveClass("loam-Price");
    expect(screen.getByRole("link", { name: "Change delivery" })).toHaveAttribute(
      "href",
      "/basket/delivery",
    );
    expect(screen.getByRole("link", { name: "Continue to payment" })).toHaveAttribute(
      "href",
      "/checkout/payment",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
