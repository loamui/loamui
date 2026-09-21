import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("tag-list", () => {
  it("is a list named Tags of Badges rendered as links, one of them the current page", async () => {
    const { container } = render(<Recipe />);
    const list = screen.getByRole("list", { name: "Tags" });
    expect(list).toHaveClass("tag-list");
    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(5);
    for (const link of links) expect(link).toHaveClass("loam-Badge");
    expect(screen.getByRole("link", { name: "Autumn sowing" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Pigeons" })).toHaveAttribute("href", "/tags/pigeons");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
