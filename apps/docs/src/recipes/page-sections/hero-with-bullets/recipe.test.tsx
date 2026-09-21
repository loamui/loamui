import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("hero-with-bullets", () => {
  it("is a region named by its h1 with a list of three points and one action", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Seed that was grown here, for here." });
    expect(region).toHaveClass("hero-with-bullets");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    for (const item of items) {
      expect(item.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("img").getAttribute("alt")).toMatch(/raised bed/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
