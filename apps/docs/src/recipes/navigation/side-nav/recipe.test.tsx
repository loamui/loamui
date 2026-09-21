import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("side-nav", () => {
  it("is a nav named by its title, with the current page marked and every icon hidden", async () => {
    const { container } = render(<Recipe />);
    const nav = screen.getByRole("navigation", { name: "Nursery" });
    expect(nav).toHaveAttribute("aria-labelledby", container.querySelector("p.title")!.id);
    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
