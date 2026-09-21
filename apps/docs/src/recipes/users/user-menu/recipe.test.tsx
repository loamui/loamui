import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("user-menu", () => {
  it("is a button named for the person that opens a menu named by the account block, ending in a sign-out form", async () => {
    const { container } = render(<Recipe />);
    const trigger = screen.getByRole("button", { name: "Account menu for Imogen Hartley" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveClass("loam-Button");
    expect(trigger.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAccessibleName("Imogen Hartley imogen@hedgerow.example");
    expect(menu.querySelectorAll("hr")).toHaveLength(2);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Your plot" })).toHaveFocus());
    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Your plot",
      "Orders",
      "Membership",
      "Sign out",
    ]);
    const signOut = screen.getByRole("menuitem", { name: "Sign out" });
    expect(signOut).toHaveAttribute("type", "submit");
    expect(signOut.closest("form")).toHaveAttribute("method", "post");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
