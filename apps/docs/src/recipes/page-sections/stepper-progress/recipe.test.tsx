import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("stepper-progress", () => {
  it("names the list for the order and marks one step current, with the ones before it complete", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Your order is being packed" })).toHaveClass(
      "stepper-progress",
    );
    const list = screen.getByRole("list", { name: "Progress of order HR-20417" });
    const steps = within(list).getAllByRole("listitem");
    expect(steps).toHaveLength(4);
    expect(steps[1]).toHaveAttribute("aria-current", "step");
    expect(list.querySelectorAll("[aria-current]")).toHaveLength(1);
    // Every step carries both hidden words and the stylesheet keeps the one
    // its position earns; jsdom applies no CSS, so the markup is what is checked.
    for (const step of steps) {
      expect(step.querySelector("span.complete")).toHaveTextContent("Completed");
      expect(step.querySelector("span.current")).toHaveTextContent("Current step");
    }
    expect(screen.getByRole("link", { name: "Back to your orders" })).toHaveAttribute(
      "href",
      "/orders",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
