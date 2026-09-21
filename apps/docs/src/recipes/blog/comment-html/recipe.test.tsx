import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("comment-html", () => {
  it("is an article named by its author whose body holds a real link, a strong and a list", async () => {
    const { container } = render(<Recipe />);
    const article = screen.getByRole("article", { name: "Tom Bradshaw" });
    expect(article).toHaveClass("comment-html");
    expect(screen.getByRole("link", { name: "autumn broad bean guide" })).toHaveAttribute(
      "href",
      "/guides/autumn-broad-beans",
    );
    expect(article.querySelector("div.body strong")).toHaveTextContent("sow a spare row");
    expect(article.querySelectorAll("div.body ul > li")).toHaveLength(3);
    expect(article.querySelector("time")).toHaveTextContent("2 days ago");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
