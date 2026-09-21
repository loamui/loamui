import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("grid-leading-item", () => {
  it("is a list of five named articles on cards with the lead first and badged", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("list").parentElement).toHaveClass("grid-leading-item");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveClass("lead");
    expect(items[0]).toContainElement(screen.getByText("Start here"));
    expect(screen.getByText("Start here").closest(".loam-Badge")).toBeInTheDocument();
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(5);
    for (const article of articles) {
      expect(article).toHaveClass("loam-Card");
      expect(article).toHaveAccessibleName();
    }
    expect(screen.getByRole("link", { name: "Read the guide" })).toHaveAttribute(
      "href",
      "/guides/first-year",
    );
    expect(screen.getAllByRole("link", { name: /^How to grow/ })).toHaveLength(3);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
