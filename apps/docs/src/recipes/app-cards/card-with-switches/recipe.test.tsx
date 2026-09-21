import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("card-with-switches", () => {
  it("is a Card holding a fieldset of switches, each named by its label and described by its line", async () => {
    const { container } = render(<Recipe />);
    expect(container.querySelector(".loam-Card")).toHaveClass("card-with-switches");
    expect(screen.getByRole("group", { name: "Notifications" })).toHaveClass("loam-Fieldset");
    expect(screen.getAllByRole("switch")).toHaveLength(4);
    const updates = screen.getByRole("switch", { name: "Order updates" });
    expect(updates).toBeChecked();
    expect(updates).toHaveAccessibleDescription(
      "An email when an order is packed and again when it is posted.",
    );
    expect(screen.getByRole("switch", { name: "Seasonal newsletter" })).not.toBeChecked();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
