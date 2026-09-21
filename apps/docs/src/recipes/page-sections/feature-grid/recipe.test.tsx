import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("feature-grid", () => {
  it("is a region named by its h2 holding a list of six features with hidden icons", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Seed you can save again" })).toHaveClass(
      "feature-grid",
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(6);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    for (const item of items) {
      expect(item.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
