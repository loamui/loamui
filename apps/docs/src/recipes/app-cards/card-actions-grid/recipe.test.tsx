import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("card-actions-grid", () => {
  it("is a Card region named Services holding nine fully named buttons and a link to the rest", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Services" });
    expect(region).toHaveClass("loam-Card");
    expect(screen.getAllByRole("button")).toHaveLength(9);
    expect(screen.getByRole("button", { name: "Book a delivery" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "And 12 more services" })).toHaveAttribute(
      "href",
      "/services",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
