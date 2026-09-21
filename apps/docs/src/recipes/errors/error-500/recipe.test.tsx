import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("error-500", () => {
  it("is a region named by its heading, with a button to try again and a link to tell someone", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Something went wrong on our side" });
    expect(region).toHaveClass("error-500");
    expect(screen.getByText("500").tagName).toBe("P");
    expect(container.querySelector("svg.illustration")).toHaveAttribute("aria-hidden", "true");
    const retry = screen.getByRole("button", { name: "Try again" });
    expect(retry).toHaveClass("loam-Button");
    expect(retry).toHaveAttribute("type", "button");
    expect(screen.getByRole("link", { name: "Tell us what happened" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
