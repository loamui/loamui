import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("slider-with-marks", () => {
  it("is a labelled native range whose marks are a datalist the input references", async () => {
    const { container } = render(<Recipe />);
    const slider = screen.getByRole("slider", { name: "Target soil moisture" });
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveValue("50");
    expect(slider).toHaveAccessibleDescription(
      "The irrigation runs until the bed's sensor reads this.",
    );
    const list = document.getElementById(slider.getAttribute("list")!)!;
    expect(list.tagName).toBe("DATALIST");
    expect(Array.from(list.querySelectorAll("option"), (o) => o.value)).toEqual([
      "0",
      "25",
      "50",
      "75",
      "100",
    ]);
    expect(container.querySelector(".loam-Range-marks")).toHaveAttribute("aria-hidden", "true");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
