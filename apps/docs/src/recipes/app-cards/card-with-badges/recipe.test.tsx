import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("card-with-badges", () => {
  it("is a Card article named by its heading, with two badges, a named amenities list and a link out", async () => {
    const { container } = render(<Recipe />);
    const article = screen.getByRole("article", { name: "Hedgerow Nursery, Ludlow" });
    expect(article).toHaveClass("loam-Card");
    expect(article.querySelectorAll(".loam-Badge")).toHaveLength(2);
    const amenities = screen.getByRole("list", { name: "On site" });
    expect(amenities.querySelectorAll("li")).toHaveLength(5);
    expect(screen.getByRole("link", { name: "Plan a visit" })).toHaveAttribute("href", "/visit");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
