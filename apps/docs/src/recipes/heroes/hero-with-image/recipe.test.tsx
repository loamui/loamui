import { renderToString } from "react-dom/server";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("hero-with-image", () => {
  it("server-renders discoverable hero imagery and usable navigation before hydration", () => {
    const html = new DOMParser().parseFromString(renderToString(<Recipe />), "text/html");
    const image = html.querySelector("img")!;
    expect(image.getAttribute("fetchPriority")).toBe("high");
    expect(image.getAttribute("loading")).not.toBe("lazy");
    expect(image.getAttribute("srcset")?.split(",")).toHaveLength(3);
    expect(html.querySelectorAll("a[href]")).toHaveLength(2);
    const heading = html.querySelector("h1")!;
    expect(html.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id);
  });

  it("introduces the page with a named region and two native navigation links", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Seed saved by growers, for growers." });
    expect(region).toHaveClass("hero-with-image");
    expect(screen.getByRole("link", { name: "Browse the catalogue" })).toHaveAttribute(
      "href",
      "/catalogue",
    );
    expect(screen.getByRole("link", { name: "Watch how we save seed" })).toHaveAttribute(
      "href",
      "/films/seed-saving",
    );
    expect(screen.getByRole("img").getAttribute("alt")).toMatch(/green shoots/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("keeps repeated regions associated with their own headings", () => {
    render(
      <>
        <Recipe />
        <Recipe />
      </>,
    );
    const regions = screen.getAllByRole("region", { name: "Seed saved by growers, for growers." });
    const headingIds = regions.map((region) => {
      const heading = within(region).getByRole("heading", { level: 1 });
      expect(region).toHaveAttribute("aria-labelledby", heading.id);
      return heading.id;
    });
    expect(new Set(headingIds).size).toBe(2);
  });
});
