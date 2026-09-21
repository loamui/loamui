import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("header-with-menus", () => {
  it("holds a named nav whose dropdowns disclose lists of links on a click, with the current page marked", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("banner")).toHaveClass("header-with-menus");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(screen.getByRole("link", { name: "Seeds" })).toHaveAttribute("aria-current", "page");

    const learn = screen.getByRole("button", { name: "Learn" });
    const support = screen.getByRole("button", { name: "Support" });
    for (const trigger of [learn, support]) {
      expect(nav.contains(trigger)).toBe(true);
      expect(trigger).toHaveClass("link");
      expect(trigger).not.toHaveClass("loam-Button");
      expect(trigger).toHaveAttribute("type", "button");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-haspopup");
      const panel = document.getElementById(trigger.getAttribute("aria-controls")!)!;
      expect(panel).toHaveClass("loam-Nav-dropdown");
      expect(nav.contains(panel)).toBe(true);
      expect(panel).not.toBeVisible();
    }
    expect(container.querySelector("[role='menu'], [role='menuitem']")).toBeNull();
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(learn);
    expect(learn).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(learn.getAttribute("aria-controls")!)!;
    expect(panel).toBeVisible();
    const links = panel.querySelectorAll("a");
    expect([...links].map((link) => link.textContent)).toEqual([
      "Growing guides",
      "Sowing calendar",
      "Seed saving",
      "Courses",
    ]);
    for (const link of links) {
      expect(link).toHaveClass("link");
      expect(link).toHaveAttribute("href");
    }
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/sign-in");
    expect(screen.getByRole("link", { name: "Join the co-op" })).toHaveClass("loam-SignpostLink");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
