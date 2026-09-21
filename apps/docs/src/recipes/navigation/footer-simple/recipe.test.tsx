import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("footer-simple", () => {
  it("is a contentinfo landmark holding a nav named Footer and the copyright line", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("contentinfo")).toHaveClass("footer-simple");
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(nav.querySelectorAll("li")).toHaveLength(4);
    expect(nav.querySelector("ul")).not.toHaveAttribute("role");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(container.querySelector("small")).toHaveTextContent("2026 Hedgerow");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
