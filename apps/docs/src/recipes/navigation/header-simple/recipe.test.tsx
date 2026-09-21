import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("header-simple", () => {
  it("is a banner holding a nav named Primary with the current page marked", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("banner")).toHaveClass("header-simple");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav.querySelector("ul.row")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Seeds" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Plants" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Join the co-op" })).toHaveAttribute(
      "href",
      "/membership/join",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
