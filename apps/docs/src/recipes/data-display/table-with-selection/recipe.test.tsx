import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("table-with-selection", () => {
  it("names each checkbox for its row, keeps the select-all box in step, and reads the count in a status", async () => {
    const { container } = render(<Recipe />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("No orders selected.");

    const first = screen.getByRole("checkbox", { name: "Select order HW-1042" });
    fireEvent.click(first);
    expect(first).toBeChecked();
    expect(status).toHaveTextContent("1 of 6 orders selected.");
    const allBox = screen.getByRole("checkbox", { name: "Select all orders" }) as HTMLInputElement;
    expect(allBox.indeterminate).toBe(true);
    expect(allBox).not.toBeChecked();

    fireEvent.click(allBox);
    expect(status).toHaveTextContent("6 of 6 orders selected.");
    expect(allBox).toBeChecked();
    expect(allBox.indeterminate).toBe(false);
    expect(container.querySelectorAll("tbody input:checked")).toHaveLength(6);

    fireEvent.click(allBox);
    expect(status).toHaveTextContent("No orders selected.");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
