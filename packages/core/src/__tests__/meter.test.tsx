import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Meter } from "../components/Meter/index.js";

afterEach(cleanup);

// jsdom cannot measure colour contrast (as in a11y.test.tsx); the token
// pairs are audited by scripts/contrast-audit.mjs instead.
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("Meter", () => {
  it("renders a native <meter> carrying the range and its accessible name", () => {
    render(<Meter value={60} max={100} label="Storage used" />);

    const meter = screen.getByRole("meter", { name: "Storage used" });
    expect(meter.tagName).toBe("METER");
    expect(meter).toHaveClass("loam-Meter");
    expect(meter).toHaveAttribute("value", "60");
    expect(meter).toHaveAttribute("min", "0");
    expect(meter).toHaveAttribute("max", "100");
  });

  it("forwards the bands to the element", () => {
    render(
      <Meter value={55} max={100} low={40} high={75} optimum={100} label="Password strength" />,
    );

    const meter = screen.getByRole("meter", { name: "Password strength" });
    expect(meter).toHaveAttribute("low", "40");
    expect(meter).toHaveAttribute("high", "75");
    expect(meter).toHaveAttribute("optimum", "100");
  });

  it("falls back to the value as a percentage of the range", () => {
    const { rerender } = render(<Meter value={0.6} label="Fraction" />);
    expect(screen.getByRole("meter", { name: "Fraction" })).toHaveTextContent("60%");

    rerender(<Meter value={30} min={20} max={40} label="Offset range" />);
    expect(screen.getByRole("meter", { name: "Offset range" })).toHaveTextContent("50%");

    // The browser clamps the value into the range; so does the fallback.
    rerender(<Meter value={140} max={100} label="Over" />);
    expect(screen.getByRole("meter", { name: "Over" })).toHaveTextContent("100%");
  });

  it("lets children replace the fallback text", () => {
    render(
      <Meter value={320} max={500} label="Disk used">
        320 GB of 500 GB
      </Meter>,
    );

    const meter = screen.getByRole("meter", { name: "Disk used" });
    expect(meter).toHaveTextContent("320 GB of 500 GB");
    expect(meter).not.toHaveTextContent("64%");
  });

  it("sets data-size, defaulting to md", () => {
    const { rerender } = render(<Meter value={0.5} label="Default size" />);
    expect(screen.getByRole("meter", { name: "Default size" })).toHaveAttribute("data-size", "md");

    rerender(<Meter value={0.5} label="Small" size="sm" />);
    expect(screen.getByRole("meter", { name: "Small" })).toHaveAttribute("data-size", "sm");
  });

  it("forwards native attributes and the ref", () => {
    let node: HTMLMeterElement | null = null;
    render(
      <Meter
        value={0.5}
        label="Forwarded"
        id="quota"
        className="extra"
        ref={(el) => {
          node = el;
        }}
      />,
    );

    const meter = screen.getByRole("meter", { name: "Forwarded" });
    expect(meter).toHaveAttribute("id", "quota");
    expect(meter).toHaveClass("loam-Meter", "extra");
    expect(node).toBe(meter);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Meter value={55} max={100} low={40} high={75} optimum={100} label="Password strength" />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
