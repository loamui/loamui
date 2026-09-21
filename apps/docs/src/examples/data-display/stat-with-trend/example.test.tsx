import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Example from "./Example";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("stat-with-trend", () => {
  it("is a Card rendered as a dl whose sparkline is an image named by its title", async () => {
    const { container } = render(<Example />);
    const tile = container.querySelector("dl.loam-Card");
    expect(tile).toHaveClass("stat-with-trend");
    expect(screen.getByText("Orders posted this week").tagName).toBe("DT");
    expect(screen.getByText("3,904").tagName).toBe("DD");
    expect(screen.getByText("Up 18% on last week").closest(".loam-Badge")).toBeInTheDocument();
    const sparkline = screen.getByRole("img", { name: /eight weeks/ });
    expect(sparkline.tagName).toBe("svg");
    expect(sparkline).toHaveAccessibleName(/Rising/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
