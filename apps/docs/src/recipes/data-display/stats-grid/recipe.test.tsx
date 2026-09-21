import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("stats-grid", () => {
  it("is a named group of three Card tiles, each a description list of one label and its figure", async () => {
    const { container } = render(<Recipe />);
    const group = screen.getByRole("group", { name: "This season at a glance" });
    const tiles = group.querySelectorAll("dl.loam-Card");
    expect(tiles).toHaveLength(3);
    for (const tile of tiles) {
      expect(tile.querySelectorAll("dt")).toHaveLength(1);
      expect(tile.querySelectorAll("dd")).toHaveLength(1);
    }
    expect(screen.getByText("Member growers").tagName).toBe("DT");
    expect(screen.getByText("1,280").tagName).toBe("DD");
    expect(screen.getByText("38,610")).toHaveClass("value");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
