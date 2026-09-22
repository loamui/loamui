import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { PasswordInput } from "../components/PasswordInput/index.js";
import { Field } from "../index.js";

afterEach(cleanup);

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("PasswordInput", () => {
  it("is a password box named by the Field, with a toggle that never renames itself", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <PasswordInput name="password" autoComplete="current-password" />
      </Field.Root>,
    );
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
    expect(input).toHaveAttribute("autocomplete", "current-password");
    expect(input).toHaveAttribute("autocapitalize", "none");
    expect(input).toHaveAttribute("spellcheck", "false");
    // The input sits inside Input's own field box, inside the PasswordInput row.
    expect(container.querySelector(".loam-PasswordInput .loam-Input-field > input")).toBe(input);

    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.type(input, "hunter22");
    await user.click(toggle);
    expect(input.type).toBe("text");
    expect(input.value).toBe("hunter22");
    // Pressed is the one signal: the name stays, so it is not said twice.
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAccessibleName("Show password");

    await user.click(toggle);
    expect(input.type).toBe("password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("takes the Field's description and error like any Input", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Password</Field.Label>
        <Field.Description>At least 12 characters.</Field.Description>
        <Field.Error>Enter a password of at least 12 characters</Field.Error>
        <PasswordInput name="password" defaultValue="short" />
      </Field.Root>,
    );
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      /At least 12 characters\. Error: Enter a password of at least 12 characters/,
    );
  });

  it("says the toggle's words in the language the labels give it", () => {
    render(
      <Field.Root>
        <Field.Label>Mot de passe</Field.Label>
        <PasswordInput name="password" labels={{ show: "Afficher le mot de passe" }} />
      </Field.Root>,
    );
    expect(screen.getByRole("button", { name: "Afficher le mot de passe" })).toBeInTheDocument();
  });

  it("lands className and ref on the input, and wrapperProps on the row", () => {
    let node: HTMLInputElement | null = null;
    const { container } = render(
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <PasswordInput
          name="password"
          className="mine"
          ref={(el) => {
            node = el;
          }}
          wrapperProps={{ className: "row", id: "row" }}
        />
      </Field.Root>,
    );
    expect(node).toBe(screen.getByLabelText("Password"));
    expect(screen.getByLabelText("Password")).toHaveClass("mine");
    expect(container.querySelector(".loam-PasswordInput")).toHaveClass("row");
    expect(container.querySelector("#row")).toHaveClass("loam-PasswordInput");
  });

  it("has no axe violations, hidden and shown", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <PasswordInput name="password" autoComplete="current-password" />
      </Field.Root>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
