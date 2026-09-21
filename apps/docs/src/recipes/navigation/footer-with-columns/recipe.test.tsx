import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("footer-with-columns", () => {
  it("is a contentinfo landmark whose columns are navs named by their headings", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("contentinfo")).toHaveClass("footer-with-columns");
    for (const name of ["Shop", "Grow", "Co-op"]) {
      const nav = screen.getByRole("navigation", { name });
      expect(nav).toHaveAttribute(
        "aria-labelledby",
        screen.getByRole("heading", { level: 3, name }).id,
      );
      expect(nav.querySelector("ul")).not.toHaveAttribute("role");
    }
    const legal = screen.getByRole("navigation", { name: "Legal" });
    expect(legal.querySelectorAll("li")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
