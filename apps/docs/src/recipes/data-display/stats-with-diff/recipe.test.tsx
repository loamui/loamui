import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("stats-with-diff", () => {
  it("is a named group of four Card tiles whose changes say their direction in words", async () => {
    const { container } = render(<Recipe />);
    const group = screen.getByRole("group", { name: "September so far, against August" });
    expect(group.querySelectorAll("dl.loam-Card")).toHaveLength(4);
    const diffs = group.querySelectorAll("dd.diff");
    expect(diffs[0]).toHaveTextContent("Up 9% on August");
    expect(diffs[0]).toHaveAttribute("data-direction", "up");
    expect(diffs[2]).toHaveTextContent("Down 4% on August");
    expect(diffs[2]).toHaveAttribute("data-direction", "down");
    expect(container.querySelector("data.loam-Price")).toHaveTextContent("£24,145");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
