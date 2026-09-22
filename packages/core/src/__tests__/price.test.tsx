import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Price } from "../components/Price/index.js";

afterEach(cleanup);

describe("Price", () => {
  it("writes the amount for people and keeps the number for machines", () => {
    render(<Price value={9.5} currency="GBP" />);
    const data = screen.getByText("£9.50");
    expect(data.tagName).toBe("DATA");
    expect(data).toHaveAttribute("value", "9.5");
  });

  it("drops the zeros of a whole amount", () => {
    render(<Price value={24} currency="GBP" />);
    expect(screen.getByText("£24")).toBeInTheDocument();
  });

  it("marks the sign of a non-zero amount through signDisplay", () => {
    const { container } = render(
      <>
        <Price value={2} currency="GBP" signDisplay="exceptZero" />
        <Price value={-4.65} currency="GBP" signDisplay="exceptZero" />
        <Price value={0} currency="GBP" signDisplay="exceptZero" />
      </>,
    );
    const texts = [...container.querySelectorAll("data")].map((el) => el.textContent);
    expect(texts[0]).toBe("+£2");
    expect(texts[1]).toMatch(/^[-−]£4\.65$/);
    expect(texts[2]).toBe("£0");
  });

  it("marks negative amounts only by default", () => {
    const { container } = render(
      <>
        <Price value={2} currency="GBP" />
        <Price value={-2} currency="GBP" />
      </>,
    );
    const texts = [...container.querySelectorAll("data")].map((el) => el.textContent);
    expect(texts[0]).toBe("£2");
    expect(texts[1]).toMatch(/^[-−]£2$/);
  });
});
