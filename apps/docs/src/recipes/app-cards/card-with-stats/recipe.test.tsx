import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("card-with-stats", () => {
  it("is a Card article with a named progress bar that speaks its value, and three figures in a list", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("article", { name: "Autumn seed-saving drive" })).toHaveClass(
      "loam-Card",
    );
    const bar = screen.getByRole("progressbar", { name: "Packets sent in" });
    expect(bar).toHaveAttribute("value", "64");
    expect(bar).toHaveAttribute("aria-valuetext", "64% of the target");
    expect(container.querySelectorAll("dl.stats dd")).toHaveLength(3);
    expect(screen.getByText("Days left").tagName).toBe("DT");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
