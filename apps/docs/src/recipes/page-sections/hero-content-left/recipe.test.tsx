import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("hero-content-left", () => {
  it("is a region named by its h1 with a hidden illustration beside the words", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Grow a variety you can keep." });
    expect(region).toHaveClass("hero-content-left");
    expect(container.querySelector("svg.illustration")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join the co-op" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "How membership works" })).toHaveAttribute(
      "href",
      "/how-it-works",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
