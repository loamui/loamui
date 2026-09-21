import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("inline-search-form", () => {
  it("is a named search landmark whose box is labelled and whose button is named by hidden text", async () => {
    const { container } = render(<Recipe />);
    // jsdom has no role for <search> yet, so the landmark is found by tag.
    const landmark = container.querySelector("search")!;
    expect(landmark).toHaveClass("inline-search-form");
    expect(landmark).toHaveAttribute("aria-label", "Search the catalogue");
    const box = screen.getByRole("searchbox", { name: "Search the catalogue" });
    expect(box).toHaveAttribute("name", "q");
    expect(landmark.querySelector("form")).toHaveAttribute("action", "/search");
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute("type", "submit");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
