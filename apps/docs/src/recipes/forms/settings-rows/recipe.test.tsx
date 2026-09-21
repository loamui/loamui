import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("settings-rows", () => {
  it("is a named group of rows whose labels are the controls' own, with one error joined to its switch", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("group", { name: "Notifications" })).toHaveClass("settings-rows");
    const updates = screen.getByRole("switch", { name: "Order updates" });
    expect(updates).toHaveAccessibleDescription(
      "An email when an order is packed and again when it is posted.",
    );
    expect(screen.getByRole("combobox", { name: "Sowing reminders" })).toHaveValue("monthly");
    expect(screen.getByRole("checkbox", { name: "Seasonal newsletter" })).not.toBeChecked();
    const alerts = screen.getByRole("switch", { name: "Text message alerts" });
    expect(alerts).toBeChecked();
    expect(alerts).toHaveAttribute("aria-invalid", "true");
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Add a mobile number to your account before turning this on");
    expect(alerts.getAttribute("aria-describedby")).toContain(error.id);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
