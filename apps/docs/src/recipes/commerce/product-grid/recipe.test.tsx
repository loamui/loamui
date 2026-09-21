import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("product-grid", () => {
  it("is a list of four product articles, each with a button named for its product", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("list")).toHaveClass("product-grid");
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(
      screen.getAllByRole("button").map((b) => b.getAttribute("aria-label") ?? b.textContent),
    ).toEqual([
      "Add Climbing bean ‘Blue Lake’ seeds to basket",
      "Add Raspberry ‘Autumn Bliss’ canes, bundle of five to basket",
      "Add Strawberry ‘Cambridge Favourite’ runners, pack of twelve to basket",
      "Add Bamboo canes, bundle of ten to basket",
    ]);
    expect(
      screen.getByRole("button", {
        name: "Add Raspberry ‘Autumn Bliss’ canes, bundle of five to basket",
      }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("s")).toHaveLength(1);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
