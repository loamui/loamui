import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("page-header", () => {
  it("is a header named by its h1, with breadcrumbs first, a list of facts and buttons last", async () => {
    const { container } = render(<Recipe />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("page-header");
    expect(header).toHaveAccessibleName("Gardener’s Delight");
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute(
      "id",
      expect.stringContaining("page-header-title"),
    );

    const crumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    expect(header.firstElementChild).toBe(crumbs);
    expect(crumbs.querySelector("[aria-current='page']")).toHaveTextContent("Gardener’s Delight");

    expect(container.querySelectorAll("ul.meta > li")).toHaveLength(3);
    expect(container.querySelector("time")).toHaveAttribute("datetime", "2026-09-01");
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(["Print label", "Request seed"]);
    expect(header.lastElementChild).toContainElement(buttons[1]!);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
