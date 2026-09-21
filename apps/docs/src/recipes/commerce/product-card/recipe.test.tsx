import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("product-card", () => {
  it("is an article named by the product, whose button and prices name and say what they are", async () => {
    const { container } = render(<Recipe />);
    const article = screen.getByRole("article", { name: "Climbing bean ‘Blue Lake’ seeds" });
    expect(article).toHaveClass("loam-Card", "product-card");
    expect(screen.getByRole("link", { name: "Climbing bean ‘Blue Lake’ seeds" })).toHaveAttribute(
      "href",
      "/seeds/climbing-bean-blue-lake",
    );
    expect(
      screen.getByRole("button", { name: "Add Climbing bean ‘Blue Lake’ seeds to basket" }),
    ).toHaveTextContent("Add Climbing bean ‘Blue Lake’ seeds to basket");
    expect(screen.getByRole("img", { name: "4.5 out of 5" })).toBeInTheDocument();
    const price = container.querySelector("p.price")!;
    expect(price).toHaveTextContent("Was £3.50 Now £2.80");
    expect(price.querySelector("s data")).toHaveAttribute("value", "3.5");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
