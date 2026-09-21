import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
// iframes: false, because axe would otherwise try to message the frame's window, which jsdom has none of.
const axeOptions = { iframes: false, rules: { "color-contrast": { enabled: false } } };

describe("embed-video", () => {
  it("is a figure whose frame is named, lazy and captioned with a link to the source", async () => {
    const { container } = render(<Recipe />);
    const frame = container.querySelector("iframe");
    expect(frame?.getAttribute("title")).toMatch(/^How to sow broad beans/);
    expect(frame).toHaveAttribute("loading", "lazy");
    expect(frame?.parentElement?.tagName).toBe("FIGURE");
    expect(screen.getByRole("link", { name: "Watch on YouTube" })).toHaveAttribute(
      "href",
      expect.stringContaining("youtube.com/watch"),
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
