import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("person-grid", () => {
  it("is a region named by its heading with four people, each named once by an h3", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Who grows your seed" })).toHaveClass("person-grid");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    for (const item of items) {
      expect(item.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
      expect(item.querySelector("h3")).toBeInTheDocument();
    }
    expect(screen.getAllByText("Mari Hughes")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
