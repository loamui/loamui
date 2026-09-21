import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

/** jsdom's own `files` setter takes only a FileList nothing can construct. */
function choose(input: HTMLInputElement, files: File[]) {
  let selected = files;
  Object.defineProperty(input, "files", {
    configurable: true,
    get: () => selected,
    set: (value: File[]) => {
      selected = value;
    },
  });
  // Match the browser's file-input reset; jsdom cannot construct a FileList.
  Object.defineProperty(input, "value", {
    configurable: true,
    get: () => "",
    set: (value: string) => {
      if (value === "") selected = [];
    },
  });
  fireEvent.change(input);
}

describe("dropzone", () => {
  it("is a labelled native file input that lists a good choice and refuses a bad one by name", async () => {
    const { container } = render(<Recipe />);
    const input = screen.getByLabelText(/Plot photos/) as HTMLInputElement;
    expect(input.type).toBe("file");
    expect(input).toHaveAttribute("accept", "image/jpeg,image/png");
    expect(input).toHaveAttribute("multiple");
    expect(input).toHaveAccessibleDescription("JPEG or PNG, up to 10 MB each, five at most.");
    expect(screen.getByLabelText(/Drop photos here/)).toBe(input);
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    const big = new File(["x"], "bed-b14.jpg", { type: "image/jpeg" });
    Object.defineProperty(big, "size", { value: 14_200_000 });
    choose(input, [big]);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "bed-b14.jpg is 14.2 MB. Each photo must be 10 MB or smaller: choose a smaller copy",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");

    choose(input, [new File(["meadow"], "meadow.png", { type: "image/png" })]);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("list")).toHaveTextContent("meadow.png 6 bytes");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
  it.each(["selection", "drop"])(
    "validates type, size and count through %s and recovers",
    (method) => {
      const { container } = render(<Recipe />);
      const input = screen.getByLabelText(/Plot photos/) as HTMLInputElement;
      const submit = (files: File[]) => {
        if (method === "selection") choose(input, files);
        else {
          choose(input, []);
          fireEvent.drop(container.querySelector(".loam-FileInput")!, {
            dataTransfer: { types: ["Files"], files },
          });
        }
      };
      const png = () => new File(["png"], "plot.png", { type: "image/png" });
      const big = png();
      Object.defineProperty(big, "size", { value: 10_000_001 });
      for (const [files, error] of [
        [[new File(["notes"], "notes.txt", { type: "text/plain" })], /Choose a JPEG or PNG/],
        [[big], /10 MB or smaller/],
        [Array.from({ length: 6 }, png), /Choose 5 photos at most/],
      ] as [File[], RegExp][]) {
        submit(files);
        expect(screen.getByRole("alert")).toHaveTextContent(error);
        expect(input.files).toHaveLength(0);
        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
      }
      const boundary = png();
      Object.defineProperty(boundary, "size", { value: 10_000_000 });
      submit([boundary]);
      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.getByRole("list")).toHaveTextContent("plot.png");
    },
  );
});
