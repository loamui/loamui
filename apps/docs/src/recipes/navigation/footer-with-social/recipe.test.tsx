import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("footer-with-social", () => {
  it("is a footer landmark with two named navs, the social links named by hidden text", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("contentinfo")).toHaveClass("footer-with-social");
    expect(screen.getByRole("link", { name: "Hedgerow" })).toHaveAttribute("href", "/");

    const social = screen.getByRole("navigation", { name: "Social" });
    const profiles = social.querySelectorAll("a");
    expect(profiles).toHaveLength(4);
    for (const link of profiles) {
      expect(link).toHaveAttribute("rel", "me");
      expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(link.querySelector(".loam-VisuallyHidden")).not.toBeNull();
    }
    expect(screen.getByRole("link", { name: "Mastodon" })).toHaveAttribute(
      "href",
      "https://mastodon.social/@hedgerowseedcoop",
    );

    const legal = screen.getByRole("navigation", { name: "Legal" });
    expect(legal.querySelectorAll("a")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Accessibility" })).toHaveAttribute(
      "href",
      "/accessibility",
    );
    expect(container.querySelector("small")).toHaveTextContent(/© 2026 Hedgerow/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
