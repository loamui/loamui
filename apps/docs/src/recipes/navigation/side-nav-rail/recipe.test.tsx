import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("side-nav-rail", () => {
  it("is a Nav of links named by hidden text, each one anchor described by a tooltip that opens on focus", async () => {
    const { container } = render(<Recipe />);
    const nav = screen.getByRole("navigation", { name: "Nursery" });
    expect(nav).toHaveClass("loam-Nav");
    expect(screen.getByRole("link", { name: "Hedgerow" })).toHaveAttribute("href", "/");
    const orders = screen.getByRole("link", { name: "Orders" });
    expect(orders).toHaveAttribute("aria-current", "page");
    expect(orders).toHaveClass("link");
    expect(nav.contains(orders)).toBe(true);
    expect(orders.closest("li")?.closest("ul")).toBe(nav.querySelector("ul"));
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
    expect(screen.getAllByRole("link")).toHaveLength(7);
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }

    // One element carries both parts: the Tooltip's wiring sits on the Nav.Link's anchor.
    expect(orders.closest(".loam-Tooltip")).not.toBeNull();
    expect(orders.closest(".loam-Tooltip")!.querySelectorAll("a")).toHaveLength(1);
    const bubble = document.getElementById(orders.getAttribute("aria-describedby")!)!;
    expect(bubble).toHaveAttribute("role", "tooltip");
    expect(bubble).toHaveTextContent("Orders");
    expect(bubble).not.toBeVisible();
    act(() => orders.focus());
    expect(bubble).toBeVisible();
    expect(orders).toHaveAttribute("data-popup-open", "true");
    act(() => orders.blur());
    expect(bubble).not.toBeVisible();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
