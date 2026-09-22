import { renderToString } from "react-dom/server";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("hero-background-image", () => {
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

  it("is a region named by its h1 whose photograph is decorative", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", {
      name: "A field of seed, saved by the people who sow it.",
    });
    expect(region).toHaveClass("hero-background-image");
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse the catalogue" })).toHaveAttribute(
      "href",
      "/catalogue",
    );
    expect(screen.getByRole("link", { name: "Watch the harvest" })).toHaveAttribute(
      "href",
      "/films/harvest",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
  it("keeps repeated hero regions named by their own heading", () => {
    render(
      <>
        <Recipe />
        <Recipe />
      </>,
    );
    const regions = screen.getAllByRole("region", {
      name: "A field of seed, saved by the people who sow it.",
    });
    const ids = regions.map((region) => {
      const heading = within(region).getByRole("heading", { level: 1 });
      expect(region).toHaveAttribute("aria-labelledby", heading.id);
      return heading.id;
    });
    expect(new Set(ids).size).toBe(2);
  });
});
