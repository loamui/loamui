import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("contact-form", () => {
  it("is a form named by its heading with every control labelled and the subject on a prompt", async () => {
    const { container } = render(<Recipe />);
    const form = screen.getByRole("form", { name: "Get in touch" });
    expect(form).toHaveClass("contact-form");
    expect(form).toHaveAttribute("method", "post");
    const email = screen.getByLabelText("Email address");
    expect(email).toHaveAccessibleDescription("Only used to reply.");
    const subject = screen.getByLabelText("What is it about?");
    expect(subject.tagName).toBe("SELECT");
    expect(subject).toHaveValue("");
    expect(subject).toBeRequired();
    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA");
    expect(screen.getByRole("button", { name: "Send message" })).toHaveAttribute("type", "submit");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
