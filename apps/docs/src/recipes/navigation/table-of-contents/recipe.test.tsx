import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("table-of-contents", () => {
  it("is a nav named On this page whose links each point at a heading in the article", async () => {
    const { container } = render(<Recipe />);
    const nav = screen.getByRole("navigation", { name: "On this page" });
    const links = nav.querySelectorAll("a");
    expect(links).toHaveLength(4);
    for (const link of links) {
      const id = link.getAttribute("href")!.slice(1);
      const heading = container.querySelector(`article h2[id="${id}"]`);
      expect(heading).not.toBeNull();
      expect(heading).toHaveTextContent(link.textContent!);
    }
    // No IntersectionObserver in jsdom: nothing is in view, so no link is
    // marked, and the markup is what the server would send.
    expect(nav.querySelector("[aria-current]")).toBeNull();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
