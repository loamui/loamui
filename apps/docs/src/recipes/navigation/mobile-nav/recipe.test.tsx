import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

// jsdom 25 implements neither showModal() nor close() on <dialog>; this
// shim toggles `open` and fires `close`, which is all the wiring needs.
// Focus containment and focus return are the browser's and run in one.
if (typeof HTMLDialogElement.prototype.showModal !== "function") {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

describe("mobile-nav", () => {
  it("is a Menu button that opens a named panel holding the primary nav, and closes from its own button", async () => {
    const { container } = render(<Recipe />);
    const trigger = screen.getByRole("button", { name: "Menu" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    const dialog = container.querySelector("dialog")!;
    expect(dialog.open).toBe(false);

    fireEvent.click(trigger);
    await waitFor(() => expect(dialog.open).toBe(true));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(dialog).toHaveAccessibleName("Hedgerow");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(dialog).toContainElement(nav);
    expect(screen.getByRole("link", { name: "Seeds" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Plants" })).not.toHaveAttribute("aria-current");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    await waitFor(() => expect(dialog.open).toBe(false));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
