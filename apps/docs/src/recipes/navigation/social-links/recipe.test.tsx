import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("social-links", () => {
  it("is a nav named Social whose icon-only links are each named by hidden text", async () => {
    const { container } = render(<Recipe />);
    const nav = screen.getByRole("navigation", { name: "Social" });
    expect(nav).toHaveClass("social-links");
    const names = ["Instagram", "YouTube", "Bluesky", "Mastodon"];
    for (const name of names) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("rel", "me");
      expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(link.querySelector("span.loam-VisuallyHidden")).toHaveTextContent(name);
      expect(link).not.toHaveAttribute("aria-label");
    }
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
