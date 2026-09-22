import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Progress } from "../components/Progress/index.js";

afterEach(cleanup);

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("Progress", () => {
  it("renders a native <progress> named by its children", () => {
    render(<Progress value={72}>Uploading photos</Progress>);
    const bar = screen.getByRole("progressbar", { name: "Uploading photos" });
    expect(bar.tagName).toBe("PROGRESS");
    expect(bar).toHaveAttribute("value", "72");
    expect(bar).toHaveAttribute("max", "100");
    expect(bar).toHaveTextContent("72%");
    expect(bar.closest(".loam-Progress")).toHaveAttribute("data-size", "md");
  });

  it("clamps the value and has no inline fill style", () => {
    render(<Progress value={140} aria-label="Over" />);
    const bar = screen.getByRole("progressbar", { name: "Over" });
    expect(bar).toHaveAttribute("value", "100");
    expect(bar).not.toHaveAttribute("style");
  });

  it("is indeterminate without a value", () => {
    render(<Progress aria-label="Preparing" />);
    const bar = screen.getByRole("progressbar", { name: "Preparing" });
    expect(bar).not.toHaveAttribute("value");
    expect(bar).toBeEmptyDOMElement();
  });

  it("writes the value in the words of labels.value", () => {
    render(
      <Progress value={75} labels={{ value: (n) => `${n / 25} of 4 files` }}>
        Importing
      </Progress>,
    );
    const bar = screen.getByRole("progressbar", { name: "Importing" });
    expect(bar).toHaveAttribute("aria-valuetext", "3 of 4 files");
    expect(bar).toHaveTextContent("3 of 4 files");
  });

  it("leaves aria-valuetext to the platform by default", () => {
    render(<Progress value={40} aria-label="Default" />);
    expect(screen.getByRole("progressbar", { name: "Default" })).not.toHaveAttribute(
      "aria-valuetext",
    );
  });

  it("emits the stripe hooks on the root", () => {
    const { container } = render(<Progress value={40} animated aria-label="Busy" />);
    const root = container.querySelector(".loam-Progress");
    expect(root).toHaveAttribute("data-striped");
    expect(root).toHaveAttribute("data-animated");
  });

  it("sends className and style to the root, ref and the rest to the bar", () => {
    const ref = { current: null as HTMLProgressElement | null };
    const { container } = render(
      <Progress
        value={10}
        className="mine"
        style={{ order: 2 }}
        ref={ref}
        id="p1"
        aria-label="X"
      />,
    );
    const root = container.querySelector(".loam-Progress")!;
    expect(root).toHaveClass("mine");
    expect(root).toHaveStyle({ order: 2 });
    expect(ref.current?.tagName).toBe("PROGRESS");
    expect(ref.current).toHaveAttribute("id", "p1");
  });

  it("warns in development when nothing names the bar", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Progress value={10} />);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("no accessible name"));
    error.mockRestore();
  });

  it("has no axe violations, determinate and indeterminate", async () => {
    const { container } = render(
      <>
        <Progress value={40}>Upload progress</Progress>
        <Progress aria-label="Preparing" />
      </>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
