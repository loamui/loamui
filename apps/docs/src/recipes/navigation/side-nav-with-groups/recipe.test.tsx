import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("side-nav-with-groups", () => {
  it("is a named nav of four native groups, only the one holding the current page open", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("navigation", { name: "Hedgerow admin" })).toBeInTheDocument();
    const groups = container.querySelectorAll("details.group");
    expect(groups).toHaveLength(4);
    const open = container.querySelectorAll("details.group[open]");
    expect(open).toHaveLength(1);
    expect(open[0]!.querySelector("summary")).toHaveTextContent("Orders");

    const current = screen.getByRole("link", { name: "Packing" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(open[0]!.contains(current)).toBe(true);
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
