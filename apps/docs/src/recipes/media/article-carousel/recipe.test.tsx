import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("article-carousel", () => {
  it("is a carousel region named by its heading, with five Card articles, named controls and a dot per article", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "From the growers’ journal" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(region.querySelectorAll("ul.track > li article.loam-Card")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Previous articles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next articles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to article 3 of 5" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read article – Picking French beans at their best" }),
    ).toHaveAttribute("href", "/journal/picking-french-beans");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
