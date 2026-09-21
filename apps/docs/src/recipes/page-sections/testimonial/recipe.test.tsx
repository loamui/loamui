import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("testimonial", () => {
  it("is a Card rendered as a figure, with the author in its figcaption and the avatar hidden", async () => {
    const { container } = render(<Recipe />);
    const figure = container.querySelector("figure.loam-Card");
    expect(figure).toHaveClass("testimonial");
    expect(figure?.querySelector("blockquote")).toHaveTextContent(/stayed for the people/);
    const caption = figure?.querySelector("figcaption");
    expect(caption).toHaveTextContent("Mari Hughes");
    expect(caption?.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByText("Mari Hughes")).toHaveLength(1);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
