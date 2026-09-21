import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("faq", () => {
  it("keeps the answers visible and the region names independent across instances", async () => {
    const { rerender, container } = render(
      <>
        <Recipe />
        <Recipe />
      </>,
    );
    const regions = screen.getAllByRole("region", { name: "Questions about the nursery" });
    expect(regions[0]!.getAttribute("aria-labelledby")).not.toBe(
      regions[1]!.getAttribute("aria-labelledby"),
    );
    for (const region of regions) {
      expect(region.querySelectorAll("li > h3")).toHaveLength(4);
      expect(region.querySelectorAll("li > p")).toHaveLength(4);
      for (const answer of region.querySelectorAll("li > p")) expect(answer).toBeVisible();
      expect(region.querySelector("details")).toBeNull();
    }
    expect(screen.getAllByRole("link", { name: "contact the nursery" })[0]).toHaveAttribute(
      "href",
      "/contact",
    );
    rerender(<Recipe />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
