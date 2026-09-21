import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("article-card", () => {
  it("is a Card rendered as an article named by its title, whose link is the title alone", async () => {
    const { container } = render(<Recipe />);
    const article = screen.getByRole("article", { name: "Overwintering onions from sets" });
    expect(article).toHaveClass("loam-Card", "article-card");
    expect(screen.getByRole("link", { name: "Overwintering onions from sets" })).toHaveAttribute(
      "href",
      "/guides/overwintering-onions",
    );
    expect(screen.getByRole("link", { name: "Rhiannon Vaughan" })).toHaveAttribute("rel", "author");
    expect(container.querySelector("address")).toContainElement(
      screen.getByRole("link", { name: "Rhiannon Vaughan" }),
    );
    expect(container.querySelector("time")).toHaveAttribute("dateTime", "2026-09-01");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
