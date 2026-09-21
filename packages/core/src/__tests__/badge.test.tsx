import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge } from "../components/Badge/index.js";

afterEach(cleanup);

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

/** A decorative swatch before the label: an icon child, detected by `:has(svg)`. */
function Dot() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="8" cy="8" r="4" />
    </svg>
  );
}

describe("Badge", () => {
  it("renders the pill on the Root and the label in Text", () => {
    render(
      <Badge.Root>
        <Badge.Text>New</Badge.Text>
      </Badge.Root>,
    );
    const label = screen.getByText("New");
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveClass("text");

    const root = label.parentElement;
    expect(root).toHaveClass("loam-Badge");
    expect(root).toHaveAttribute("data-size", "md");
  });

  it("keeps a composed icon outside the label, so the words stand alone", () => {
    render(
      <Badge.Root>
        <Dot />
        <Badge.Text>Live</Badge.Text>
      </Badge.Root>,
    );
    const label = screen.getByText("Live");
    // The icon is a sibling of the label, not inside it: that is what lets a
    // consumer put it on either side by moving the child.
    expect(label.querySelector("svg")).toBeNull();
    const icon = label.parentElement?.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon?.nextElementSibling).toBe(label);
  });

  it("render substitutes the element and keeps the pill", () => {
    render(
      <Badge.Root render={<a href="#tag" />} size="sm">
        <Badge.Text>design</Badge.Text>
      </Badge.Root>,
    );
    const link = screen.getByRole("link", { name: "design" });
    expect(link).toHaveClass("loam-Badge");
    expect(link).toHaveAttribute("data-size", "sm");
  });

  it("has no axe violations as a link with an icon", async () => {
    const { container } = render(
      <Badge.Root render={<a href="#tag" />}>
        <Dot />
        <Badge.Text>design</Badge.Text>
      </Badge.Root>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
