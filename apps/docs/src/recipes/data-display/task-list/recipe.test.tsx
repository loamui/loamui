import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("task-list", () => {
  it("is a region named by its heading whose task links are described by their status", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Join the co-op" });
    expect(region).toHaveClass("task-list");
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    const plot = screen.getByRole("link", { name: "Choose a plot" });
    expect(plot).toHaveAccessibleDescription(
      "Pick a bed on one of the member fields, or join the waiting list for Ludlow. In progress",
    );
    expect(screen.getByRole("link", { name: "Your details" })).toHaveAccessibleDescription(
      "Completed",
    );
    expect(screen.queryByRole("link", { name: "Pay the membership fee" })).toBeNull();
    expect(screen.getByText("Completed").closest(".loam-Badge")).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
