import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("error-404-image", () => {
  it("is a region named by its h1, with a hidden illustration and a signpost back", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Nothing is growing here" });
    expect(region).toHaveClass("error-404-image");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Nothing is growing here");
    expect(screen.getByText("404").tagName).toBe("P");
    expect(region.querySelector("svg.illustration")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "Back to the home page" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
