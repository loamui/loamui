import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("grid-asymmetric", () => {
  it("is a list of three named articles on cards whose lead comes first and carries the photograph", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("list").parentElement).toHaveClass("grid-asymmetric");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveClass("lead");
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(3);
    for (const article of articles) {
      expect(article).toHaveClass("loam-Card");
      expect(article).toHaveAccessibleName();
    }
    expect(screen.getByRole("img")).toHaveAccessibleName(/walking between young orchard trees/);
    expect(items[0]).toContainElement(screen.getByRole("img"));
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
