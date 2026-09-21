import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("header-with-search", () => {
  it("holds a named nav, a search landmark with a named box, and an account link named by hidden text", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("banner")).toHaveClass("header-with-search");
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Seeds" })).toHaveAttribute("aria-current", "page");

    // The landmark is the search element itself; jsdom's role map does not
    // know it yet, so it is found by name.
    const search = container.querySelector("search")!;
    expect(search).toHaveAttribute("aria-label", "Search");
    expect(search.querySelector("form")).toHaveAttribute("action", "/search");
    expect(screen.getByRole("searchbox", { name: "Search the catalogue" })).toHaveAttribute(
      "name",
      "q",
    );
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute("type", "submit");

    const account = screen.getByRole("link", { name: "Your account" });
    expect(account).toHaveAttribute("href", "/account");
    expect(account.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
