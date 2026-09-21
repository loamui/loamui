import { renderToString } from "react-dom/server";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";
import BackgroundBanner from "../banner-background-image/Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("banner-with-image", () => {
  it("keeps the same offer in both image treatments, with independent heading relationships", () => {
    render(
      <>
        <Recipe />
        <BackgroundBanner />
        <Recipe />
      </>,
    );
    const regions = screen.getAllByRole("region", { name: "Members save 20% on fruit plants" });
    const ids = regions.map((region) => {
      const heading = within(region).getByRole("heading", { level: 2 });
      expect(region).toHaveAttribute("aria-labelledby", heading.id);
      expect(region.querySelector("header")?.textContent).toBe(
        regions[0]!.querySelector("header")?.textContent,
      );
      return heading.id;
    });
    expect(new Set(ids).size).toBe(3);
  });

  it("server-renders a named promotion, responsive image and working destination", () => {
    const html = new DOMParser().parseFromString(renderToString(<Recipe />), "text/html");
    const image = html.querySelector("img")!;
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(image.getAttribute("sizes")).toBe("auto, 100vw");
    expect(image.getAttribute("srcset")?.split(",")).toHaveLength(3);
    expect(image.getAttribute("width")).toBe("1600");
    expect(image.getAttribute("height")).toBe("1200");
    expect(html.querySelector("a")?.getAttribute("href")).toBe("/catalogue/fruit");
    expect(html.querySelector("section")?.getAttribute("aria-labelledby")).toBe(
      html.querySelector("h2")!.id,
    );
  });

  it("is a region named by its h2 with a photograph that carries alt text and one link to go", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Members save 20% on fruit plants" })).toHaveClass(
      "banner-with-image",
    );
    expect(screen.getByRole("img").getAttribute("alt")).toMatch(/raspberries/);
    expect(screen.getByText("Offer").closest(".loam-Badge")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See the fruit list" })).toHaveAttribute(
      "href",
      "/catalogue/fruit",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
