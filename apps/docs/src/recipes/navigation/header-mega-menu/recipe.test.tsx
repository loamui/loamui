import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("header-mega-menu", () => {
  it("discloses a wide panel of guide links from a button in the primary nav", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("banner")).toHaveClass("header-mega-menu");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(screen.getByRole("link", { name: "Seeds" })).toHaveAttribute("aria-current", "page");

    const trigger = screen.getByRole("button", { name: "Growing" });
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
    expect(container.querySelector("[role='menu'], [role='menuitem'], [role='dialog']")).toBeNull();
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(panel).toBeVisible();
    const guides = panel.querySelectorAll("ul.guides a");
    expect(guides).toHaveLength(6);
    for (const guide of guides) {
      expect(guide).toHaveClass("link");
      expect(guide).toHaveAttribute("href");
    }
    expect(guides[0]).toHaveAccessibleName(
      "Sowing calendar What to sow this month, by crop and by region.",
    );
    expect(screen.getByRole("link", { name: "See the course" })).toHaveAttribute(
      "href",
      "/courses/beginners",
    );
    // The example's own icons; a SignpostLink hides its chevron by the span around it.
    for (const svg of container.querySelectorAll("svg:not(.loam-SignpostLink svg)")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/sign-in");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
