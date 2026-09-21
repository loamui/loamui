import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("side-nav-with-search", () => {
  it("holds a search landmark, a named nav whose counts name their links, and an account link", async () => {
    const { container } = render(<Recipe />);
    // The landmark is the search element itself; jsdom's role map does not
    // know it yet, so it is found by name.
    const search = container.querySelector("search")!;
    expect(search).toHaveAttribute("aria-label", "Search");
    expect(search.querySelector("form")).toHaveAttribute("action", "/nursery/search");
    expect(screen.getByRole("searchbox", { name: "Search the nursery" })).toHaveAttribute(
      "name",
      "q",
    );

    expect(screen.getByRole("navigation", { name: "Nursery" })).toBeInTheDocument();
    const orders = screen.getByRole("link", { name: "Orders 12 to pack" });
    expect(orders).toHaveAttribute("aria-current", "page");
    expect(orders.querySelector(".loam-Badge")).toHaveTextContent("12");
    expect(screen.getByRole("link", { name: "Messages 3 unread" })).not.toHaveAttribute(
      "aria-current",
    );

    const account = screen.getByRole("link", { name: "Imogen Hartley imogen@hedgerow.example" });
    expect(account).toHaveAttribute("href", "/account");
    expect(account.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
