import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

const firstRowHeader = () => screen.getAllByRole("rowheader")[0];

describe("table-sortable", () => {
  it("carries aria-sort on the sorted column and reorders the rows on a press", async () => {
    const { container } = render(<Recipe />);
    const variety = screen.getByRole("columnheader", { name: /^Variety/ });
    expect(variety).toHaveAttribute("aria-sort", "ascending");
    expect(firstRowHeader()).toHaveTextContent("Beetroot");

    const stock = screen.getByRole("columnheader", { name: /^In stock/ });
    expect(stock).toHaveAttribute("aria-sort", "none");
    fireEvent.click(screen.getByRole("button", { name: "In stock sort ascending" }));
    expect(stock).toHaveAttribute("aria-sort", "ascending");
    expect(variety).toHaveAttribute("aria-sort", "none");
    expect(firstRowHeader()).toHaveTextContent("Tomato");

    fireEvent.click(screen.getByRole("button", { name: "In stock sort descending" }));
    expect(stock).toHaveAttribute("aria-sort", "descending");
    expect(firstRowHeader()).toHaveTextContent("Lettuce");

    expect(screen.getAllByText("Low")).toHaveLength(2);
    expect(container.querySelector("caption")).toHaveTextContent(/Seed stock/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
