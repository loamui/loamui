import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

// jsdom 25 does not implement <dialog> showModal/close; the Drawer opens
// through them, so the test shims the two methods to toggle `open`.
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

describe("mini-basket", () => {
  it("opens from a counted trigger to a dialog named by its title, holding two lines named by their products", async () => {
    const { container } = render(<Recipe />);
    const trigger = screen.getByRole("button", { name: "Basket 2 products" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    fireEvent.click(trigger);

    const dialog = (await screen.findByRole("dialog", {
      name: "Your basket",
    })) as HTMLDialogElement;
    await waitFor(() => expect(dialog.open).toBe(true));
    expect(trigger).toHaveAttribute("data-popup-open", "true");

    expect(
      within(dialog).getByRole("article", { name: "Climbing bean ‘Blue Lake’ seeds" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("article", { name: "Raspberry ‘Autumn Bliss’ canes" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("spinbutton", {
        name: "Quantity of Raspberry ‘Autumn Bliss’ canes",
      }),
    ).toHaveValue(1);
    expect(
      within(dialog).getByRole("button", { name: "Remove Raspberry ‘Autumn Bliss’ canes" }),
    ).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Go to checkout" })).toHaveAttribute(
      "href",
      "/checkout",
    );
    expect(within(dialog).getByText("Total").nextElementSibling).toHaveTextContent("£33.55");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(within(dialog).getByRole("button", { name: "Close basket" }));
    await waitFor(() => expect(dialog.open).toBe(false));
    expect(trigger).not.toHaveAttribute("data-popup-open");
  });
  it("derives prices, validates drafts and supports remove, undo and an empty basket", async () => {
    render(<Recipe />);
    fireEvent.click(screen.getByRole("button", { name: "Basket 2 products" }));
    const dialog = await screen.findByRole("dialog", { name: "Your basket" });
    const basket = within(dialog);
    const quantity = basket.getByRole("spinbutton", { name: /Quantity of Climbing/ });
    fireEvent.change(quantity, { target: { value: "5" } });
    expect(basket.getByText("Subtotal").nextElementSibling).toHaveTextContent("£38");
    expect(basket.getByText("Total").nextElementSibling).toHaveTextContent("£41.95");
    fireEvent.change(quantity, { target: { value: "" } });
    fireEvent.blur(quantity);
    expect(quantity).toHaveAttribute("aria-invalid", "true");
    expect(basket.queryByRole("link", { name: "Go to checkout" })).toBeNull();
    expect(basket.getByText("Total").nextElementSibling).toHaveTextContent(
      "Enter valid quantities",
    );
    fireEvent.change(quantity, { target: { value: "5" } });
    fireEvent.click(basket.getByRole("button", { name: /Remove Raspberry/ }));
    expect(basket.getAllByRole("article")).toHaveLength(1);
    expect(basket.getByText("Total").nextElementSibling).toHaveTextContent("£17.95");
    expect(basket.getByRole("button", { name: "Undo removal" })).toHaveFocus();
    fireEvent.click(basket.getByRole("button", { name: "Undo removal" }));
    expect(basket.getAllByRole("article")).toHaveLength(2);
    expect(basket.getByRole("button", { name: "Close basket" })).toHaveFocus();
    fireEvent.click(basket.getByRole("button", { name: /Remove Raspberry/ }));
    fireEvent.click(basket.getByRole("button", { name: /Remove Climbing/ }));
    expect(basket.queryByRole("article")).toBeNull();
    expect(basket.getByText("Your basket is empty.")).toBeVisible();
    expect(basket.getByText("Total").nextElementSibling).toHaveTextContent("£0");
    expect(basket.queryByRole("link", { name: "Go to checkout" })).toBeNull();
    fireEvent.click(basket.getByRole("button", { name: "Undo removal" }));
    expect(basket.getByRole("spinbutton")).toHaveValue(5);
  });
});
