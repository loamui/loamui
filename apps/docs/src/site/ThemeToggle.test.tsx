import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ThemeToggle } from "./ThemeToggle";

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

beforeEach(() => {
  // jsdom has no matchMedia; the system scheme here is light.
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/**
 * One button, named for what pressing it does next. The scheme it sets is
 * carried on <html> and remembered; choosing the system's own scheme clears
 * both, so the preference never shadows the system for no reason.
 */
describe("the theme toggle", () => {
  it("names the switch it offers, and renames it once pressed", async () => {
    const { container } = render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Switch to dark" });
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Switch to light" })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("loamui-theme")).toBe("dark");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("clears the preference when the choice matches the system", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark" }));
    fireEvent.click(screen.getByRole("button", { name: "Switch to light" }));
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem("loamui-theme")).toBeNull();
  });
});
