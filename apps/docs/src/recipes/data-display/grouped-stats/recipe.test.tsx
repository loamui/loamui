import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("grouped-stats", () => {
  it("is a Card region named by its heading, holding one list of three figures with their comparisons in words", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Open day, 5 September" })).toHaveClass("loam-Card");
    expect(container.querySelectorAll("dl.groups > div.group")).toHaveLength(3);
    expect(screen.getByText("Visitors").tagName).toBe("DT");
    expect(screen.getByText("1,840").tagName).toBe("DD");
    expect(screen.getByText("Three fewer than last year.")).toHaveClass("compare");
    expect(container.querySelector("data.loam-Price")).toHaveAttribute("value", "6320");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
