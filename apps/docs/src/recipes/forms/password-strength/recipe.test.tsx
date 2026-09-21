import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("password-strength", () => {
  it("describes the box by its rules as well as its description, and ticks a rule once it is met", async () => {
    const { container } = render(<Recipe />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("autocomplete", "new-password");
    const rules = container.querySelector<HTMLElement>("ul.rules")!;
    expect(input.getAttribute("aria-describedby")!.split(" ")).toEqual(
      expect.arrayContaining([`${input.id}-description`, rules.id]),
    );
    const meter = screen.getByRole("meter", { name: "Password length" });
    expect(meter).toHaveAttribute("aria-valuetext", "Nothing typed yet");
    expect(rules.querySelectorAll("li[data-met]")).toHaveLength(0);

    fireEvent.change(input, { target: { value: "hedgerow seed saver" } });
    expect(within(rules).getByText("At least 12 characters").closest("li")).toHaveAttribute(
      "data-met",
    );
    expect(rules.querySelectorAll("li[data-met]")).toHaveLength(1);
    expect(meter).toHaveAttribute("aria-valuetext", "19 characters. Length requirement met.");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
  it("does not label repetition as strong or claim to compare an email address", () => {
    const { container } = render(<Recipe />);
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "aaaaaaaaaaaaaaaa" } });
    expect(screen.getByRole("meter")).toHaveAttribute(
      "aria-valuetext",
      "16 characters. Length requirement met.",
    );
    expect(container).not.toHaveTextContent(/Strong|Not your email address/);
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "short" } });
    expect(screen.getByRole("meter")).toHaveAttribute(
      "aria-valuetext",
      "5 characters. 7 more needed.",
    );
  });
});
