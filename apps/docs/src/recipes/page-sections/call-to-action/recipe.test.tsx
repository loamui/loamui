import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("call-to-action", () => {
  it("is a region named by its heading with a primary signpost and one alternative link", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Ready to sow?" });
    expect(region).toHaveClass("call-to-action");
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveClass("loam-SignpostLink");
    expect(links[0]).toHaveAttribute("href", "/catalogue");
    expect(links[1]).toHaveTextContent("What to sow this month");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
