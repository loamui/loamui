import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("button-with-menu", () => {
  it("is a button named Create new that opens a menu of links, each named by its words alone", async () => {
    const { container } = render(<Recipe />);
    const trigger = screen.getByRole("button", { name: "Create new" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveClass("loam-Button");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Sowing record",
      "Plot note",
      "Seed listing",
      "Swap request",
    ]);
    expect(items[0]).toHaveAttribute("href", "/new/sowing");
    expect(items[0]!.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    await waitFor(() => expect(items[0]).toHaveFocus());
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
