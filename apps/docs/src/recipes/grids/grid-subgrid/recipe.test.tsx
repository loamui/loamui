import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("grid-subgrid", () => {
  it("is a list of three cards that are the items, each with a heading, a description and a booking link in that order", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("list").parentElement).toHaveClass("grid-subgrid");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    for (const item of items) {
      expect(item).toHaveClass("loam-Card");
      expect(item).toHaveAccessibleName();
      const parts = Array.from(item.children).map((child) => child.className);
      expect(parts).toEqual(["head", "description", "actions"]);
    }
    expect(screen.getAllByRole("link", { name: /^Book a place/ })).toHaveLength(3);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
