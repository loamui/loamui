import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("copy-to-clipboard", () => {
  it("shows the link in a labelled read-only box and copies it from a button named for the action", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const { container } = render(<Recipe />);
    const box = screen.getByRole("textbox", { name: "Your referral link" });
    expect(box).toHaveAttribute("readonly");
    expect(box).toHaveValue("https://hedgerow.example/join/ivy-b14");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith("https://hedgerow.example/join/ivy-b14");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });
});
