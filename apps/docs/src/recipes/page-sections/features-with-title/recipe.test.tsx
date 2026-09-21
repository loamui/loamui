import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("features-with-title", () => {
  it("is a region named by its h2 with a link and a list of four points", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Why seed from a co-op is different" })).toHaveClass(
      "features-with-title",
    );
    expect(screen.getByRole("link", { name: "How we save seed" })).toHaveAttribute(
      "href",
      "/about/seed",
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    for (const item of items) {
      expect(item.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
