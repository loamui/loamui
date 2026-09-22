import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Field, Input } from "../index.js";

afterEach(cleanup);

describe("Field composition wiring", () => {
  it("links the label to the control and gathers describedby ids", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Description>We'll never share it.</Field.Description>
        <Field.Control render={<input type="email" />} />
        <Field.Error>Enter a valid email.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByLabelText("Email");
    const description = screen.getByText("We'll never share it.");
    const error = screen.getByRole("alert");

    // Label htmlFor matches the control id.
    expect(input).toHaveAttribute("id");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(describedBy).toContain(description.id);
    expect(describedBy).toContain(error.id);
    // Explicit validation state is forwarded independently of the error content.
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(error).toHaveAttribute("role", "alert");
  });

  it("keeps a control's own aria-describedby after the Field's ids", () => {
    const { rerender } = render(
      <>
        <p id="rules">Letters and digits only.</p>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Field.Description>Shown on your profile.</Field.Description>
          <Field.Error>{null}</Field.Error>
          <Input aria-describedby="rules" />
        </Field.Root>
      </>,
    );
    const input = screen.getByLabelText("Username");
    const description = screen.getByText("Shown on your profile.");
    expect(input).toHaveAttribute("aria-describedby", `${description.id} rules`);

    rerender(
      <>
        <p id="rules">Letters and digits only.</p>
        <Field.Root invalid>
          <Field.Label>Username</Field.Label>
          <Field.Description>Shown on your profile.</Field.Description>
          <Field.Error>Enter a username</Field.Error>
          <Input aria-describedby="rules" />
        </Field.Root>
      </>,
    );
    const error = screen.getByRole("alert");
    expect(input).toHaveAttribute("aria-describedby", `${description.id} ${error.id} rules`);
    expect(input).toHaveAccessibleDescription(
      "Shown on your profile. Error: Enter a username Letters and digits only.",
    );
  });

  it("does the same through Field.Control, each id once", () => {
    render(
      <>
        <p id="rules">Letters and digits only.</p>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Field.Description>Shown on your profile.</Field.Description>
          <Field.Control render={<input aria-describedby="rules rules" />} />
        </Field.Root>
      </>,
    );
    const input = screen.getByLabelText("Username");
    const description = screen.getByText("Shown on your profile.");
    expect(input).toHaveAttribute("aria-describedby", `${description.id} rules`);
  });

  it("omits error wiring when there is no error content", () => {
    render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Field.Control render={<input />} />
        <Field.Error>{null}</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByLabelText("Name");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(input.getAttribute("aria-describedby")).toBeNull();
  });

  it("renders an optional hint in the label instead of an asterisk", () => {
    render(
      <Field.Root>
        <Field.Label optional>Company</Field.Label>
        <Field.Control render={<input />} />
      </Field.Root>,
    );

    expect(screen.getByText(/\(optional\)/)).toBeInTheDocument();
    // No required asterisk convention.
    expect(screen.queryByText("*")).toBeNull();
  });

  it("supports a function render for the control", () => {
    render(
      <Field.Root>
        <Field.Label>Bio</Field.Label>
        <Field.Control render={(props) => <textarea {...props} data-custom="yes" />} />
      </Field.Root>,
    );

    const control = screen.getByLabelText("Bio");
    expect(control.tagName).toBe("TEXTAREA");
    expect(control).toHaveAttribute("data-custom", "yes");
  });

  it("opens native errors on submit, clears them on correction, and resets them with the form", () => {
    const { container } = render(
      <form>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input type="email" required />
        </Field.Root>
      </form>,
    );
    const input = screen.getByLabelText("Email") as HTMLInputElement;
    const form = container.querySelector("form")!;

    fireEvent.blur(input);
    expect(input).not.toHaveAttribute("aria-invalid");

    fireEvent.invalid(input);
    expect(input).toHaveAttribute("aria-invalid", "true");

    fireEvent.input(input, { target: { value: "name@example.com" } });
    expect(input).not.toHaveAttribute("aria-invalid");

    fireEvent.input(input, { target: { value: "" } });
    fireEvent.invalid(input);
    expect(input).toHaveAttribute("aria-invalid", "true");
    fireEvent.reset(form);
    expect(input).not.toHaveAttribute("aria-invalid");
  });
});

describe("Field labels", () => {
  it("says its own words in the language the labels give it", () => {
    render(
      <Field.Root invalid labels={{ optional: "(facultatif)", errorPrefix: "Erreur : " }}>
        <Field.Label optional>Société</Field.Label>
        <Field.Error>Saisissez le nom de votre société</Field.Error>
        <Input />
      </Field.Root>,
    );
    expect(screen.getByLabelText("Société (facultatif)")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Erreur : Saisissez le nom de votre société",
    );
  });

  it("prefixes an error with hidden words by default", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Error>Enter your email address</Field.Error>
        <Input />
      </Field.Root>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Error: Enter your email address");
    expect(screen.getByRole("alert").querySelector(".loam-VisuallyHidden")).toHaveTextContent(
      "Error:",
    );
  });
});

describe("Input", () => {
  it("renders the field box around the native input, forwarding attributes, style and ref", () => {
    let node: HTMLInputElement | null = null;
    const { container } = render(
      <Input
        aria-label="Handle"
        className="mine"
        name="handle"
        autoComplete="username"
        style={{ textAlign: "end" }}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Handle" });
    // The box is the wrapper: it paints the surface, border and focus ring,
    // and it is what an adornment sits beside. Textarea and Select render the
    // same shape, so a field looks and aligns the same whichever it holds.
    expect(container.children).toHaveLength(1);
    const box = container.firstElementChild!;
    expect(box).toHaveClass("loam-Input-field");
    expect(box.firstElementChild).toBe(input);
    expect(input.tagName).toBe("INPUT");
    expect(node).toBe(input);
    // className lands on the control, not the box: a consumer styling "the
    // input" means the input, and the box is the library's to paint.
    expect(input).toHaveClass("mine");
    expect(input.style.textAlign).toBe("end");
    expect(input).toHaveAttribute("autocomplete", "username");
    expect(input).toHaveAttribute("name", "handle");
  });

  it("forwards the native size attribute", () => {
    render(<Input aria-label="Year" size={4} />);
    expect(screen.getByLabelText("Year")).toHaveAttribute("size", "4");
  });
});
