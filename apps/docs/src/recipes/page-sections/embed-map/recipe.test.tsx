import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
// iframes: false, because axe would otherwise try to message the frame's window, which jsdom has none of.
const axeOptions = { iframes: false, rules: { "color-contrast": { enabled: false } } };

describe("embed-map", () => {
  it("is a figure whose frame is named for what it shows and whose caption gives the way there in words", async () => {
    const { container } = render(<Recipe />);
    const frame = container.querySelector("iframe");
    expect(frame?.getAttribute("title")).toMatch(/^Map showing/);
    expect(frame).toHaveAttribute("loading", "lazy");
    expect(container.querySelector("figcaption")).toHaveTextContent(/north of Ludlow/);
    expect(screen.getByRole("link", { name: "Open in OpenStreetMap" })).toHaveAttribute(
      "href",
      expect.stringContaining("openstreetmap.org"),
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
