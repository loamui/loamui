import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("logo-wall", () => {
  it("is a list of six marks, each an image named for its organisation", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Stocked by" })).toHaveClass("logo-wall");
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("role", "list");
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    const marks = screen.getAllByRole("img");
    expect(marks).toHaveLength(6);
    for (const mark of marks) expect(mark.getAttribute("aria-label")).not.toMatch(/logo/i);
    expect(screen.getByRole("img", { name: "Teme Valley Growers" })).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
