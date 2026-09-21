import { describe, it, expect, afterEach, beforeAll } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

// jsdom 25 has no dialog.showModal; the Modal opens through it. Enough of
// a shim to toggle `open`, so the test can see the dialog appear.
beforeAll(() => {
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
});

describe("gallery-lightbox", () => {
  it("links every thumbnail to the full file and opens it in a dialog named by the caption", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    const link = screen.getByRole("link", {
      name: "Rows of the trial beds seen from the bank above",
    });
    expect(link).toHaveAttribute("href", expect.stringContaining("/1600/1067"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(link);
    const dialog = await screen.findByRole("dialog", { name: "The trial beds in April" });
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", link.getAttribute("href"));
    expect(within(dialog).getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
