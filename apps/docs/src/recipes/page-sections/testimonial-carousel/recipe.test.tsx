import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("testimonial-carousel", () => {
  it("is a carousel region named by its heading, with three quotes and named controls", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "What members say" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(region).toHaveClass("testimonial-carousel");
    expect(region.querySelectorAll("ul.track > li")).toHaveLength(3);
    expect(region.querySelectorAll("figure.loam-Card blockquote")).toHaveLength(3);
    const previous = screen.getByRole("button", { name: "Previous" });
    expect(previous).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
