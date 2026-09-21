import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("footer-centered", () => {
  it("is a footer landmark with a brand link, a named nav of links and small print", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("contentinfo")).toHaveClass("footer-centered");
    expect(screen.getByRole("link", { name: "Hedgerow" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(nav.querySelectorAll("li")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Growing guides" })).toHaveAttribute("href", "/guides");
    expect(container.querySelector("small")).toHaveTextContent(/© 2026 Hedgerow/);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
