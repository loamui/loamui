import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("choice-cards-radio", () => {
  it("is a radiogroup of cards, each a label around a radio named by its title alone", async () => {
    const { container } = render(<Recipe />);
    const group = screen.getByRole("radiogroup", { name: "Choose a membership" });
    expect(group).toHaveClass("choice-cards-radio");
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    const grower = screen.getByRole("radio", { name: "Grower" });
    expect(grower).toBeChecked();
    expect(grower.getAttribute("name")).toBeTruthy();
    for (const radio of radios) expect(radio).toHaveAttribute("name", grower.getAttribute("name"));
    expect(grower).toHaveAccessibleDescription(/£40 a year/);
    const card = grower.closest("label")!;
    expect(card).toHaveClass("loam-Card");
    expect(card).toHaveAttribute("for", grower.id);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
  it("keeps two copies independent and accepts an application's form name", () => {
    render(
      <>
        <Recipe />
        <Recipe name="other-plan" />
      </>,
    );
    const [first, second] = screen.getAllByRole("radiogroup");
    const firstGrower = within(first!).getByRole("radio", { name: "Grower" });
    const secondGrower = within(second!).getByRole("radio", { name: "Grower" });
    expect(firstGrower.getAttribute("name")).not.toBe(secondGrower.getAttribute("name"));
    expect(secondGrower).toHaveAttribute("name", "other-plan");
    fireEvent.click(within(first!).getByRole("radio", { name: "Friend" }));
    expect(firstGrower).not.toBeChecked();
    expect(secondGrower).toBeChecked();
  });
});
