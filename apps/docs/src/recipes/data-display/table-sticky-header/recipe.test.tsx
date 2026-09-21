import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("table-sticky-header", () => {
  it("is a Table asked for a sticky header and capped through its public property, holding all twelve rows", async () => {
    const { container } = render(<Recipe />);
    const table = container.querySelector<HTMLElement>(".loam-Table")!;
    expect(table).toHaveClass("stock");
    expect(table).toHaveAttribute("data-sticky-header");
    expect(container.querySelector("div.table-sticky-header")).toContainElement(table);
    expect(screen.getByRole("table")).toHaveAccessibleName(/Seed stock on 8 September 2026/);
    expect(screen.getAllByRole("rowheader")).toHaveLength(12);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    // The cap is Table's public property, declared on the Table from the
    // recipe's own scope rather than as a rule on a wrapper.
    const css = readFileSync(join(__dirname, "recipe.css"), "utf8");
    expect(css).toMatch(/\.loam-Table\)[^{]*\{\s*:scope\s*\{\s*--loam-table-block-size:/);
    expect(css).not.toMatch(/thead|position:\s*sticky|box-shadow/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
