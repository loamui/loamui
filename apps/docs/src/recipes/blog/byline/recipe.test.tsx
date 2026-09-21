import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("byline", () => {
  it("puts the author in an address around a rel=author link, with two machine-readable dates", async () => {
    const { container } = render(<Recipe />);
    const author = screen.getByRole("link", { name: "Nia Prosser" });
    expect(author).toHaveAttribute("rel", "author");
    expect(author.closest("address")).toBeInTheDocument();
    const times = [...container.querySelectorAll("time")];
    expect(times.map((t) => t.getAttribute("dateTime"))).toEqual(["2026-08-28", "2026-09-04"]);
    expect(times[0]).toHaveTextContent("28 August 2026");
    expect(times[1]!.parentElement).toHaveTextContent("Updated 4 September 2026");
    expect(container.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
