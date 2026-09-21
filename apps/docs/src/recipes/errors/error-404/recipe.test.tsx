import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("error-404", () => {
  it("is a region named by its heading, with no picture and two ways out", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Page not found" });
    expect(region).toHaveClass("error-404");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page not found");
    expect(screen.getByText("404").tagName).toBe("P");
    // No illustration: the only svg is the SignpostLink's own arrow.
    expect(container.querySelector("img, svg.illustration")).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("link", { name: "Back to the home page" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Browse the catalogue" })).toHaveAttribute(
      "href",
      "/catalogue",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
