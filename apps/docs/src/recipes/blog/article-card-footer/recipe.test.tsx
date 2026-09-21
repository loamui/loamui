import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("article-card-footer", () => {
  it("is a Card article named by its title, with a footer holding the author, the date and the likes in words", async () => {
    const { container } = render(<Recipe />);
    const article = screen.getByRole("article", { name: "Curing winter squash for storage" });
    expect(article).toHaveClass("loam-Card");
    expect(screen.getByRole("link", { name: "Curing winter squash for storage" })).toHaveAttribute(
      "href",
      "/journal/curing-winter-squash",
    );
    const footer = article.querySelector("footer");
    expect(footer?.querySelector('a[rel="author"]')).toHaveTextContent("Dafydd Rees");
    expect(footer?.querySelector("time")).toHaveAttribute("datetime", "2026-09-02");
    expect(footer?.querySelector("p.likes")).toHaveTextContent("124 likes");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
