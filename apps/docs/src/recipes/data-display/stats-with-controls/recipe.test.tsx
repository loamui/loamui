import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("stats-with-controls", () => {
  it("is a region named by the date, whose buttons move the day and whose meters are named", async () => {
    const { container } = render(<Recipe />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(/^Tuesday,? 8 September 2026$/);
    expect(screen.getByRole("region", { name: /8 September 2026/ })).toHaveClass(
      "stats-with-controls",
    );

    expect(container.querySelectorAll("dl.figures > div.figure.loam-Card")).toHaveLength(3);
    const posted = screen.getByLabelText("Orders posted, of capacity");
    expect(posted.tagName).toBe("METER");
    expect(posted).toHaveAttribute("value", "84");
    expect(posted).toHaveAttribute("max", "200");

    // Today is the last day with figures, so Next is at the end of the
    // range: still focusable, but a press goes nowhere.
    const next = screen.getByRole("button", { name: "Next day" });
    expect(next).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(next);
    expect(heading).toHaveTextContent(/^Tuesday,? 8 September 2026$/);

    const previous = screen.getByRole("button", { name: "Previous day" });
    expect(previous).not.toHaveAttribute("aria-disabled");
    fireEvent.click(previous);
    expect(heading).toHaveTextContent(/^Monday,? 7 September 2026$/);
    expect(posted).toHaveAttribute("value", "132");
    expect(next).not.toHaveAttribute("aria-disabled");

    fireEvent.click(previous);
    fireEvent.click(previous);
    expect(heading).toHaveTextContent(/^Thursday,? 3 September 2026$/);
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
