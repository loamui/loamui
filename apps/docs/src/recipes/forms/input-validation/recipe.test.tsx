import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("input-validation", () => {
  it("says nothing until the box is left, then reports the platform's verdict in words and clears it once the address is right", async () => {
    const { container } = render(<Recipe />);
    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(input).toBeRequired();
    expect(input).not.toHaveAttribute("aria-invalid");

    fireEvent.input(input, { target: { value: "rowan" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.blur(input);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      "Error: Enter an email address with an @, like rowan@example.com",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")!.split(" ")).toContain(alert.id);

    fireEvent.input(input, { target: { value: "" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your email address");

    fireEvent.input(input, { target: { value: "rowan@example.com" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
