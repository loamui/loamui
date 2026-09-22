import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("image-comparison", () => {
  it("is a figure whose named range writes the reveal position onto it", async () => {
    const { container } = render(<Recipe />);
    const figure = container.querySelector(".image-comparison figure") as HTMLElement;
    expect(figure.style.getPropertyValue("--_position")).toBe("50%");
    const slider = screen.getByRole("slider", { name: "Reveal the colour photograph" });
    expect(slider).toHaveAccessibleDescription(/Move the slider to compare/);
    for (const value of [0, 25, 100]) {
      fireEvent.change(slider, { target: { value: String(value) } });
      expect(figure.style.getPropertyValue("--_position")).toBe(`${value}%`);
      expect(slider).toHaveAttribute("aria-valuetext", `${value}% colour photograph`);
    }
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[1]?.getAttribute("alt")).toMatch(/colour/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
