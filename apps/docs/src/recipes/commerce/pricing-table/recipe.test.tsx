import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("pricing-table", () => {
  it("is a named list of three articles, each named by its heading, with one recommended", async () => {
    const { container } = render(<Recipe />);
    const list = screen.getByRole("list", { name: "Membership plans" });
    expect(list).toHaveClass("pricing-table");
    for (const name of ["Seedling", "Grower", "Plot-holder"]) {
      const article = screen.getByRole("article", { name });
      expect(article).toHaveClass("loam-Card", "plan");
      expect(screen.getByRole("button", { name: `Choose ${name}` })).toBeInTheDocument();
    }
    const recommended = container.querySelectorAll("li.recommended");
    expect(recommended).toHaveLength(1);
    expect(recommended[0]?.querySelector("h3")).toHaveTextContent("Grower");
    expect(recommended[0]?.querySelector("data.loam-Price")).toHaveAttribute("value", "48");
    expect(container.querySelectorAll("li.exclusion s")).toHaveLength(3);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
