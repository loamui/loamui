import { renderToString } from "react-dom/server";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, within, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("sign-in-with-errors", () => {
  it("clears corrected client errors and summary links without taking focus or validating early", () => {
    render(<Recipe />);
    const email = screen.getByLabelText("Email address");
    const other = screen.getByLabelText("Password");
    fireEvent.input(email, { target: { value: "grower@" } });
    fireEvent.blur(email);
    expect(screen.queryByRole("group", { name: "There is a problem" })).not.toBeInTheDocument();
    expect(email).not.toHaveAttribute("aria-invalid", "true");

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    const summary = screen.getByRole("group", { name: "There is a problem" });
    expect(summary).toHaveFocus();
    email.focus();
    fireEvent.input(email, { target: { value: "grower@." } });
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(within(summary).getAllByRole("link")).toHaveLength(2);

    fireEvent.input(email, { target: { value: "grower@example.com" } });
    expect(email).not.toHaveAttribute("aria-invalid", "true");
    expect(document.getElementById(`${email.id}-error`)).not.toBeInTheDocument();
    expect(screen.getByRole("group", { name: "There is a problem" })).toBe(summary);
    expect(within(summary).getAllByRole("link")).toHaveLength(1);
    expect(other).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveFocus();

    other.focus();
    fireEvent.input(other, { target: { value: "A corrected value" } });
    expect(other).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByRole("group", { name: "There is a problem" })).not.toBeInTheDocument();
    expect(other).toHaveFocus();

    fireEvent.input(email, { target: { value: "" } });
    expect(screen.queryByRole("group", { name: "There is a problem" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("group", { name: "There is a problem" })).toHaveFocus();
  });

  it("does not treat native-valid edits as proof that server errors are resolved", () => {
    render(
      <Recipe
        initialResponse={{
          values: { email: "grower@example.com", remember: false },
          errors: {
            email: "Use the email address registered with your organisation",
            form: "The server could not complete this request",
          },
        }}
      />,
    );
    const email = screen.getByLabelText("Email address");
    email.focus();
    fireEvent.input(email, { target: { value: "another@example.com" } });
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(
      within(screen.getByRole("group", { name: "There is a problem" })).getByRole("link"),
    ).toHaveTextContent("Use the email address registered with your organisation");
    expect(screen.getByText("The server could not complete this request")).toBeInTheDocument();
    expect(email).toHaveFocus();
  });

  it("renders a rejected POST with preserved email and session choice, but no password", async () => {
    const initialResponse = {
      values: { email: "grower@example.com", remember: true },
      errors: { form: "Email address and password do not match" },
    };
    const html = new DOMParser().parseFromString(
      renderToString(<Recipe initialResponse={initialResponse} />),
      "text/html",
    );
    expect(html.querySelector('[name="email"]')?.getAttribute("value")).toBe("grower@example.com");
    expect(html.querySelector('[name="password"]')?.hasAttribute("value")).toBe(false);
    expect(html.querySelector('[name="remember"]')?.hasAttribute("checked")).toBe(true);
    expect(html.body.textContent).toContain(initialResponse.errors.form);

    const { container } = render(<Recipe initialResponse={initialResponse} />);
    expect(screen.getByRole("group", { name: "There is a problem" })).toHaveFocus();
    expect(screen.getByLabelText("Email address")).toHaveValue("grower@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("");
    expect(screen.getByRole("checkbox", { name: "Keep me signed in" })).toBeChecked();
    expect(screen.getByLabelText("Email address")).not.toHaveAttribute("aria-invalid", "true");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "another passphrase" } });
    expect(fireEvent.submit(screen.getByRole("form", { name: "Sign in" }))).toBe(true);
    expect(screen.queryByRole("group", { name: "There is a problem" })).not.toBeInTheDocument();
  });

  it("connects server field errors to the corresponding controls", async () => {
    render(
      <Recipe
        initialResponse={{
          values: { email: "grower@", remember: false },
          errors: { email: "Enter an email address in the correct format, like name@example.com" },
        }}
      />,
    );
    const email = screen.getByLabelText("Email address");
    expect(email).toHaveAttribute("aria-invalid", "true");
    fireEvent.click(
      within(screen.getByRole("group", { name: "There is a problem" })).getByRole("link"),
    );
    await waitFor(() => expect(email).toHaveFocus());
  });

  it("uses native invalid events to summarise errors and removes corrected fields on retry", () => {
    render(<Recipe action="/account/session" />);
    const form = screen.getByRole("form", { name: "Sign in" });
    const submit = screen.getByRole("button", { name: "Sign in" });
    expect(form).toHaveAttribute("action", "/account/session");
    fireEvent.click(submit);
    expect(screen.getByRole("group", { name: "There is a problem" })).toHaveFocus();
    expect(
      within(screen.getByRole("group", { name: "There is a problem" })).getAllByRole("link"),
    ).toHaveLength(2);
    fireEvent.input(screen.getByLabelText("Email address"), {
      target: { value: "grower@example.com" },
    });
    fireEvent.click(submit);
    const summary = screen.getByRole("group", { name: "There is a problem" });
    expect(summary).toHaveFocus();
    expect(within(summary).getAllByRole("link")).toHaveLength(1);
    expect(within(summary).getByRole("link")).toHaveTextContent("Enter your password");
    expect(screen.getByLabelText("Email address")).not.toHaveAttribute("aria-invalid", "true");
  });

  it("reveals a password without submitting, changing its value or validating early", () => {
    render(<Recipe />);
    const password = screen.getByLabelText("Password");
    fireEvent.input(password, { target: { value: "a pasted passphrase" } });
    const toggle = screen.getByRole("button", { name: "Show password" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(password).toHaveAttribute("type", "text");
    expect(password).toHaveValue("a pasted passphrase");
    expect(screen.queryByRole("group", { name: "There is a problem" })).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAttribute("autocomplete", "current-password");
  });

  it("server-renders native POST controls and labels before hydration", () => {
    const html = new DOMParser().parseFromString(renderToString(<Recipe />), "text/html");
    const form = html.querySelector("form")!;
    expect(form.getAttribute("method")).toBe("post");
    expect(form.noValidate).toBe(false);
    expect(form.getAttribute("action")).toBe("/sign-in");
    for (const name of ["email", "password"]) {
      const control = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name="${name}"]`,
      )!;
      expect(control.required).toBe(true);
      expect(
        Array.from(form.querySelectorAll("label")).some((label) => label.htmlFor === control.id),
      ).toBe(true);
    }
    expect(form.querySelector('[name="email"]')?.getAttribute("autocomplete")).toBe("username");
  });

  it("shows errors only after submission, preserves values and focuses matching summary links", async () => {
    const { container } = render(<Recipe />);
    const form = screen.getByRole("form", { name: "Sign in" });
    expect(screen.queryByRole("group", { name: "There is a problem" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Keep me signed in" })).not.toBeChecked();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
    const email = screen.getByLabelText("Email address");
    fireEvent.input(email, { target: { value: "imogen@" } });
    expect(fireEvent.submit(form)).toBe(false);
    const summary = screen.getByRole("group", { name: "There is a problem" });
    expect(summary).toHaveFocus();
    expect(email).toHaveValue("imogen@");
    for (const label of ["Email address", "Password"]) {
      const input = screen.getByLabelText(label);
      const error = document.getElementById(`${input.id}-error`)!;
      const link = within(summary).getByRole("link", {
        name: error.textContent!.replace(/^Error:\s*/, ""),
      });
      expect(link).toHaveAttribute("href", `#${input.id}`);
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input.getAttribute("aria-describedby")).toContain(error.id);
    }
    fireEvent.click(within(summary).getByRole("link", { name: "Enter your password" }));
    await waitFor(() => expect(screen.getByLabelText("Password")).toHaveFocus());
    expect(await axe(container, axeOptions)).toHaveNoViolations();
    fireEvent.submit(form);
    expect(screen.getByRole("group", { name: "There is a problem" })).toHaveFocus();
  });

  it("accepts native-valid input and leaves the POST to the application's endpoint", () => {
    render(<Recipe />);
    const form = screen.getByRole("form", { name: "Sign in" });
    fireEvent.submit(form);
    fireEvent.input(screen.getByLabelText("Email address"), {
      target: { value: "imogen@hedgerow" },
    });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "test password" } });
    expect(fireEvent.submit(form)).toBe(true);
    expect(form).toHaveAttribute("action", "/sign-in");
    expect(form).toHaveAttribute("method", "post");
    expect(screen.queryByRole("group", { name: "There is a problem" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Password")).toHaveValue("test password");
  });

  it("keeps repeated forms' errors and control IDs independent", () => {
    render(
      <>
        <Recipe />
        <Recipe />
      </>,
    );
    const forms = screen.getAllByRole("form", { name: "Sign in" });
    fireEvent.submit(forms[1]!);
    expect(
      within(forms[0]!).queryByRole("group", { name: "There is a problem" }),
    ).not.toBeInTheDocument();
    const ids = forms.flatMap((form) => [
      within(form).getByLabelText("Email address").id,
      within(form).getByLabelText("Password").id,
    ]);
    expect(new Set(ids).size).toBe(4);
    expect(within(forms[1]!).getByRole("link", { name: "Enter your password" })).toHaveAttribute(
      "href",
      `#${ids[3]}`,
    );
  });
});
