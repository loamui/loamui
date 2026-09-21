import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("article-header", () => {
  it("is an article named by its h1, with the author in an address, two dated times and a named tag list", async () => {
    const { container } = render(<Recipe />);
    const article = screen.getByRole("article", { name: "Sowing broad beans in autumn" });
    expect(article).toHaveClass("article-header");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Sowing broad beans in autumn",
    );
    expect(container.querySelector("address")).toContainElement(
      screen.getByRole("link", { name: "Nia Prosser" }),
    );
    const times = container.querySelectorAll("time");
    expect([...times].map((t) => t.getAttribute("dateTime"))).toEqual(["2026-08-28", "2026-09-04"]);
    expect(times[1]!.parentElement).toHaveTextContent(/^Updated /);
    const tags = screen.getByRole("list", { name: "Tags" });
    expect(tags.querySelectorAll("a.loam-Badge")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Legumes" })).toHaveAttribute("href", "/tags/legumes");
    expect(screen.getByRole("figure")).toContainElement(
      screen.getByRole("img", {
        name: "A crate of freshly picked beans on the packing bench",
      }),
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
