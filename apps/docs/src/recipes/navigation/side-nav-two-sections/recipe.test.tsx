import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("side-nav-two-sections", () => {
  it("is one nav named by its title holding two lists, the current page marked and a sign-out that posts", async () => {
    const { container } = render(<Recipe />);
    const nav = screen.getByRole("navigation", { name: "Nursery" });
    expect(nav).toHaveAttribute("aria-labelledby", container.querySelector("p.title")!.id);
    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(screen.getAllByRole("link")).toHaveLength(7);
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Settings" })).not.toHaveAttribute("aria-current");

    const signOut = screen.getByRole("button", { name: "Sign out" });
    expect(signOut).toHaveAttribute("type", "submit");
    expect(signOut).toHaveClass("link");
    expect(signOut.closest("form")).toHaveAttribute("method", "post");
    expect(nav.contains(signOut)).toBe(true);
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
