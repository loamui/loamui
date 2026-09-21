import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("users-grid", () => {
  it("is a list of articles named by their headings, each with a mail link, a price and a signpost", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("list")).toHaveClass("users-grid");
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(4);
    expect(articles[0]).toHaveAccessibleName("Imogen Hartley");
    expect(articles[0]).toHaveClass("loam-Card");
    expect(articles[0]!.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");

    expect(screen.getByRole("link", { name: "tomos@hedgerow.example" })).toHaveAttribute(
      "href",
      "mailto:tomos@hedgerow.example",
    );
    const prices = container.querySelectorAll("data.loam-Price");
    expect(prices).toHaveLength(4);
    expect(prices[3]).toHaveAttribute("value", "18.5");
    expect(prices[3]).toHaveTextContent("£18.50an hour");
    const book = screen.getAllByRole("link", { name: "Book a session" });
    expect(book).toHaveLength(4);
    expect(book[1]).toHaveAttribute("href", "/growers/bryn");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
