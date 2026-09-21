import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("features-with-cards", () => {
  it("is a region named by its h2 holding six cards that are the list items", async () => {
    const { container } = render(<Recipe />);
    expect(
      screen.getByRole("region", { name: "Everything a grower needs, from one bench" }),
    ).toHaveClass("features-with-cards");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(6);
    for (const item of items) {
      expect(item).toHaveClass("loam-Card");
      expect(item.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
