import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("button-with-progress", () => {
  it("is a button named for its action that disables itself and shows a named progress bar until the status says the upload is done", async () => {
    const { container } = render(<Recipe />);
    const button = screen.getByRole("button", { name: "Upload 5 photos" });
    expect(button).toBeEnabled();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    vi.useFakeTimers();
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Uploading 5 photos…");
    const bar = screen.getByRole("progressbar", { name: "Upload progress" });
    expect(bar.tagName).toBe("PROGRESS");
    expect(bar).not.toBe(button);
    expect(button).not.toContainElement(bar);

    act(() => vi.advanceTimersByTime(1000));
    expect(bar).toHaveAttribute("aria-valuetext", "40% uploaded");

    act(() => vi.advanceTimersByTime(2000));
    expect(bar).toHaveAttribute("aria-valuetext", "100% uploaded");
    // The full bar stands for a moment before the button comes back.
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("Upload 5 photos");
    expect(screen.getByRole("status")).toHaveTextContent("5 photos uploaded.");
  });
});
