import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("table-reviews", () => {
  it("is a captioned table whose split cells say both shares in words around a named meter", async () => {
    const { container } = render(<Recipe />);
    expect(container.querySelector("caption")).toHaveTextContent(/would grow it again/);
    expect(screen.getAllByRole("rowheader")).toHaveLength(6);
    const splits = container.querySelectorAll("td.split");
    expect(splits[0]).toHaveTextContent("91% would");
    expect(splits[0]).toHaveTextContent("9% would not");
    const meter = splits[0]?.querySelector("meter.loam-Meter");
    expect(meter).toHaveAttribute("value", "91");
    expect(meter).toHaveAttribute("max", "100");
    expect(meter).toHaveAccessibleName("Would grow again");
    expect(screen.getAllByRole("img", { name: "4.7 out of 5" })).toHaveLength(1);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
