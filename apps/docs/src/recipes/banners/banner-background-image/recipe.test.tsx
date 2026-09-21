import { renderToString } from "react-dom/server";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("banner-background-image", () => {
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

  it("has accessible semantics for one promotion", async () => {
    const { container } = render(<Recipe />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("keeps heading relationships independent when copied twice", () => {
    render(
      <>
        <Recipe />
        <Recipe />
      </>,
    );
    const sections = screen.getAllByRole("region", { name: "Members save 20% on fruit plants" });
    expect(sections).toHaveLength(2);
    expect(sections[0]!.getAttribute("aria-labelledby")).not.toBe(
      sections[1]!.getAttribute("aria-labelledby"),
    );
    for (const section of sections) {
      expect(section).toHaveAttribute(
        "aria-labelledby",
        within(section).getByRole("heading", { level: 2 }).id,
      );
      expect(section.querySelector("img")).toHaveAttribute("alt", "");
      expect(section.querySelectorAll("a")).toHaveLength(1);
      expect(section.querySelector("a")).toHaveAttribute("href", "/catalogue/fruit");
    }
  });
});
