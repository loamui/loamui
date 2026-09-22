import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { FileInput } from "../components/FileInput/index.js";
import { Field } from "../index.js";

afterEach(cleanup);

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

function Picker(props: { multiple?: boolean; onChange?: () => void }) {
  return (
    <Field.Root>
      <Field.Label>Passport scan</Field.Label>
      <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
      <FileInput.Root data-testid="root">
        <FileInput.Control accept=".pdf,.png" {...props} />
        <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
        <FileInput.Files />
      </FileInput.Root>
    </Field.Root>
  );
}

// jsdom's `files` setter accepts only its own FileList, which nothing can
// construct; a writable instance property lets the drop handler's assignment
// land so the change it dispatches can be observed.
function acceptAnyFiles(input: HTMLInputElement) {
  Object.defineProperty(input, "files", { configurable: true, writable: true, value: null });
}

describe("FileInput", () => {
  it("is labelled by the Field label and by its own prompt", () => {
    render(<Picker />);
    const input = screen.getByLabelText(/Passport scan/) as HTMLInputElement;
    expect(input.type).toBe("file");
    // Inside a Root the Prompt is the box, so the control wears the shared
    // hidden class rather than a recipe of its own.
    expect(input).toHaveClass("loam-VisuallyHidden");
    expect(screen.getByLabelText(/Choose a file or drop it here/)).toBe(input);
    expect(input).toHaveAccessibleDescription("PDF or PNG, up to 5 MB");
  });

  it("labels the input by its prompt alone outside a Field", () => {
    render(
      <FileInput.Root>
        <FileInput.Control />
        <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
        <FileInput.Files />
      </FileInput.Root>,
    );
    expect(screen.getByLabelText("Choose a file or drop it here")).toHaveAttribute("type", "file");
  });

  it("forwards accept, multiple, name and required to the native input", () => {
    render(
      <FileInput.Root>
        <FileInput.Control accept="image/*" multiple name="photos" required />
        <FileInput.Prompt>Choose photos</FileInput.Prompt>
      </FileInput.Root>,
    );
    const input = screen.getByLabelText("Choose photos");
    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveAttribute("multiple");
    expect(input).toHaveAttribute("name", "photos");
    expect(input).toBeRequired();
  });

  it("the bare control self-wires from a Field", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Receipt</Field.Label>
        <Field.Error>Choose a file smaller than 5 MB</Field.Error>
        <FileInput.Control />
      </Field.Root>,
    );
    const input = screen.getByLabelText("Receipt");
    expect(input).toHaveAttribute("type", "file");
    // Outside a Root there is no box to stand in for it, so it stays in view.
    expect(input).not.toHaveClass("loam-VisuallyHidden");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/Choose a file smaller than 5 MB/);
  });

  it("lists a chosen file's name and size in the polite live region", async () => {
    const user = userEvent.setup();
    render(<Picker />);
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("aria-live", "polite");
    expect(list).toBeEmptyDOMElement();

    const file = new File(["x".repeat(2048)], "passport.png", { type: "image/png" });
    await user.upload(screen.getByLabelText(/Passport scan/), file);

    const item = within(list).getByRole("listitem");
    expect(item).toHaveTextContent("passport.png");
    expect(item).toHaveTextContent("2 kB");
  });

  it("marks the box while a file is dragged over it, then takes the drop as a change", () => {
    const onChange = vi.fn();
    render(<Picker onChange={onChange} />);
    const root = screen.getByTestId("root");
    const input = screen.getByLabelText(/Passport scan/) as HTMLInputElement;
    acceptAnyFiles(input);
    const file = new File(["hello"], "passport.pdf", { type: "application/pdf" });
    const dataTransfer = { types: ["Files"], files: [file], dropEffect: "none" };

    fireEvent.dragEnter(root, { dataTransfer });
    expect(root).toHaveAttribute("data-dragging");
    fireEvent.dragOver(root, { dataTransfer });
    expect(dataTransfer.dropEffect).toBe("copy");

    fireEvent.drop(root, { dataTransfer });
    expect(root).not.toHaveAttribute("data-dragging");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input.files).toBe(dataTransfer.files);
    expect(within(screen.getByRole("list")).getByRole("listitem")).toHaveTextContent(
      "passport.pdf",
    );
  });

  it("keeps only the first dropped file when the control is not multiple", () => {
    // jsdom has no DataTransfer; this stand-in records what the handler builds.
    class FakeDataTransfer {
      files: File[] = [];
      items = { add: (file: File) => this.files.push(file) };
    }
    vi.stubGlobal("DataTransfer", FakeDataTransfer);
    try {
      render(<Picker />);
      const input = screen.getByLabelText(/Passport scan/) as HTMLInputElement;
      acceptAnyFiles(input);
      const files = [new File(["a"], "one.pdf"), new File(["b"], "two.pdf")];

      fireEvent.drop(screen.getByTestId("root"), { dataTransfer: { types: ["Files"], files } });

      expect(Array.from(input.files ?? [])).toEqual([files[0]]);
      expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("keeps every dropped file when the control is multiple", () => {
    render(<Picker multiple />);
    const input = screen.getByLabelText(/Passport scan/) as HTMLInputElement;
    acceptAnyFiles(input);
    const files = [new File(["a"], "one.pdf"), new File(["b"], "two.pdf")];

    fireEvent.drop(screen.getByTestId("root"), { dataTransfer: { types: ["Files"], files } });

    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(2);
  });

  it("ignores a drag that carries no files", () => {
    render(<Picker />);
    const root = screen.getByTestId("root");
    fireEvent.dragEnter(root, { dataTransfer: { types: ["text/plain"], files: [] } });
    expect(root).not.toHaveAttribute("data-dragging");
  });

  it("clears the box when the pointer leaves it", () => {
    render(<Picker />);
    const root = screen.getByTestId("root");
    const dataTransfer = { types: ["Files"], files: [] };
    fireEvent.dragEnter(root, { dataTransfer });
    // Crossing into the prompt fires a nested enter/leave pair; the box
    // must stay marked until the pointer leaves the box itself.
    fireEvent.dragEnter(screen.getByText(/Choose a file/), { dataTransfer });
    fireEvent.dragLeave(screen.getByText(/Choose a file/), { dataTransfer });
    expect(root).toHaveAttribute("data-dragging");
    fireEvent.dragLeave(root, { dataTransfer });
    expect(root).not.toHaveAttribute("data-dragging");
  });

  it("empties the list when the form resets", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <Picker />
        <button type="reset">Start again</button>
      </form>,
    );
    await user.upload(screen.getByLabelText(/Passport scan/), new File(["x"], "passport.png"));
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Start again" }));
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });

  it("has no axe violations, before and after a choice", async () => {
    const user = userEvent.setup();
    const { container } = render(<Picker />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    await user.upload(screen.getByLabelText(/Passport scan/), new File(["x"], "passport.png"));
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});

it.each([false, true])(
  "links the Prompt to an explicit Control ID (inside Field: %s)",
  (inField) => {
    function Example({ id }: { id?: string }) {
      const picker = (
        <FileInput.Root>
          <FileInput.Control id={id} />
          <FileInput.Prompt>Upload</FileInput.Prompt>
        </FileInput.Root>
      );
      return inField ? <Field.Root>{picker}</Field.Root> : picker;
    }
    const { rerender } = render(<Example id="first-upload" />);
    expect(screen.getByLabelText("Upload")).toHaveAttribute("id", "first-upload");
    rerender(<Example id="next-upload" />);
    expect(screen.getByLabelText("Upload")).toHaveAttribute("id", "next-upload");
    rerender(<Example />);
    expect(screen.getByLabelText("Upload")).not.toHaveAttribute("id", "next-upload");
  },
);
