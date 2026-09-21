import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("stats-with-segments", () => {
  it("is a captioned table with a named meter per device and a total row in the foot", async () => {
    const { container } = render(<Recipe />);
    expect(container.querySelector("caption")).toHaveTextContent(/by device/);
    expect(screen.getAllByRole("rowheader")).toHaveLength(4);
    const phone = screen.getByLabelText("Phone, share of visits");
    expect(phone.tagName).toBe("METER");
    expect(phone).toHaveAttribute("value", "62");
    expect(phone).toHaveAttribute("max", "100");
    expect(container.querySelectorAll("tbody meter")).toHaveLength(3);
    expect(container.querySelector("tfoot")).toHaveTextContent("All devices24,000100%");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
