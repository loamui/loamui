import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("autocomplete-async", () => {
  it("is a labelled combobox whose list fills with the matches once the search answers", async () => {
    const { container } = render(<Recipe />);
    const box = screen.getByRole("combobox", { name: "Variety" });
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector('input[type="hidden"][name="variety"]')).toHaveValue("");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.change(box, { target: { value: "kale" } });
    expect(box).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Searching the seed list");
    expect(container.querySelector(".loam-Loader")).toHaveAttribute("aria-hidden", "true");

    // The stand-in search answers after 600ms; the wait allows for a busy suite.
    const option = await screen.findByRole(
      "option",
      { name: "Kale 'Nero di Toscana'" },
      { timeout: 3000 },
    );
    expect(screen.getByRole("listbox")).toContainElement(option);
    expect(screen.getByRole("status")).toHaveTextContent("1 variety matches");
    expect(container.querySelector(".loam-Loader")).toBeNull();
    expect(container.querySelector("p.status")).toHaveTextContent("1 variety matches.");

    fireEvent.click(option);
    expect(box).toHaveValue("Kale 'Nero di Toscana'");
    expect(container.querySelector('input[type="hidden"][name="variety"]')).toHaveValue(
      "Kale 'Nero di Toscana'",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
  it("settles loading when an existing result is chosen during a replacement search", async () => {
    const { container } = render(<Recipe />);
    const input = screen.getByRole("combobox", { name: "Variety" });
    fireEvent.change(input, { target: { value: "kale" } });
    const option = await screen.findByRole(
      "option",
      { name: "Kale 'Nero di Toscana'" },
      { timeout: 3000 },
    );
    fireEvent.change(input, { target: { value: "k" } });
    expect(container.querySelector(".loam-Loader")).not.toBeNull();
    fireEvent.click(option);
    expect(input).toHaveValue("Kale 'Nero di Toscana'");
    expect(container.querySelector(".loam-Loader")).toBeNull();
    expect(container.querySelector("p.status")).toHaveTextContent("selected.");
    // Let the cancelled request's deadline pass: it must not replace selection feedback.
    await new Promise((resolve) => setTimeout(resolve, 650));
    expect(container.querySelector("p.status")).toHaveTextContent("selected.");
    expect(container.querySelector(".loam-Loader")).toBeNull();
  });
});
