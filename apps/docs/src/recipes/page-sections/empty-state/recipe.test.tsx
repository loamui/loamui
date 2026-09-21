import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("empty-state", () => {
  it("sits in a Card with no landmark or live region, a hidden picture and one next step", async () => {
    const { container } = render(<Recipe />);
    expect(container.querySelector(".empty-state")).toHaveClass("loam-Card");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("heading", { level: 2, name: "No orders yet" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Browse the catalogue" })).toHaveAttribute(
      "href",
      "/catalogue",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
