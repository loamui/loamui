import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("timeline", () => {
  it("is an ordered list of dated events, each date a time with a machine-readable value", async () => {
    const { container } = render(<Recipe />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(list.parentElement).toHaveClass("timeline");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(5);
    for (const item of items) {
      const time = item.querySelector("time");
      expect(time?.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}$/);
      expect(item.querySelector("h3")).toBeInTheDocument();
    }
    expect(
      screen.getByRole("heading", { level: 3, name: "The first catalogue" }),
    ).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
