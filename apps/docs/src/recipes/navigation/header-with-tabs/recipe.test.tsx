import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("header-with-tabs", () => {
  it("holds a named nav of tab links with the current one marked, and an account menu named for the person", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("banner")).toHaveClass("header-with-tabs");
    expect(screen.getByRole("navigation", { name: "Nursery" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();

    const trigger = screen.getByRole("button", { name: "Account menu for Imogen Hartley" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveClass("loam-Button");
    expect(trigger.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Your plot" })).toHaveFocus());
    const signOut = screen.getByRole("menuitem", { name: "Sign out" });
    expect(signOut).toHaveAttribute("type", "submit");
    expect(signOut.closest("form")).toHaveAttribute("method", "post");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
