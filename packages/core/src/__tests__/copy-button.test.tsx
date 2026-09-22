import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { CopyButton } from "../components/CopyButton/index.js";

const writeText = vi.fn<(text: string) => Promise<void>>();

/**
 * Stand in for the platform clipboard. Installed AFTER userEvent.setup(),
 * which puts user-event's own clipboard stub on navigator; ours has to be
 * the one the component reaches. `null` stands for a context with no
 * Clipboard API at all.
 */
function stubClipboard(clipboard: { writeText: typeof writeText } | null = { writeText }) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: clipboard ?? undefined,
  });
}

function setup(clipboard?: { writeText: typeof writeText } | null) {
  const user = userEvent.setup();
  stubClipboard(clipboard);
  return user;
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  writeText.mockReset().mockResolvedValue(undefined);
  // Back to the platform's own getter on Navigator.prototype.
  Reflect.deleteProperty(navigator, "clipboard");
});

writeText.mockResolvedValue(undefined);

// Colour-contrast needs a real browser to compute styles (jsdom can't); it
// is checked live by Storybook's a11y addon.
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("CopyButton", () => {
  it("copies the value and says so, then reverts after the timeout", async () => {
    vi.useFakeTimers();
    stubClipboard();
    render(<CopyButton value="pnpm add @loamui/core" timeout={1500} />);
    const status = screen.getByRole("status");
    expect(status).toBeEmptyDOMElement();

    // fireEvent, not userEvent: user-event's own delays would sit on the
    // faked clock. The awaited act flushes the resolved writeText promise.
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });
    expect(writeText).toHaveBeenCalledWith("pnpm add @loamui/core");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(status).toHaveTextContent("Copied");

    act(() => {
      vi.advanceTimersByTime(1499);
    });
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    // Emptied, so the next copy is a change of text and is announced again.
    expect(status).toBeEmptyDOMElement();
  });

  it("uses the given labels", async () => {
    const user = setup();
    render(
      <CopyButton value="https://example.com" labels={{ copied: "Link copied" }}>
        Copy link
      </CopyButton>,
    );
    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByRole("button", { name: "Link copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Link copied");
  });

  it("keeps the accessible name of an icon-only button", async () => {
    const user = setup();
    render(
      <CopyButton value="token" aria-label="Copy token">
        <svg aria-hidden />
      </CopyButton>,
    );
    await user.click(screen.getByRole("button", { name: "Copy token" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied"));
    // The aria-label still names the button and the glyph stays put, so an
    // icon-only button keeps its shape; the status carries the news.
    const button = screen.getByRole("button", { name: "Copy token" });
    expect(button).not.toHaveTextContent("Copied");
    expect(button.querySelector("svg")).not.toBeNull();
  });

  it("announces a refused clipboard and leaves the label alone", async () => {
    writeText.mockRejectedValue(new DOMException("Denied", "NotAllowedError"));
    const onCopy = vi.fn();
    const user = setup();
    render(<CopyButton value="secret" onCopy={onCopy} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Copy failed: select the text and copy it yourself",
      ),
    );
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
    expect(onCopy).not.toHaveBeenCalled();
  });

  it("announces the failure when there is no clipboard API", async () => {
    const user = setup(null);
    render(<CopyButton value="secret" labels={{ failed: "Nothing was copied" }} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Nothing was copied"));
  });

  it("calls onCopy with the value after a successful copy", async () => {
    const onCopy = vi.fn();
    const user = setup();
    render(<CopyButton value="hello" onCopy={onCopy} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() => expect(onCopy).toHaveBeenCalledWith("hello"));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it("forwards Button props and honours a consumer's onClick", async () => {
    const onClick = vi.fn();
    const user = setup();
    render(
      <CopyButton value="x" className="mine" onClick={onClick} data-testid="copy">
        Copy
      </CopyButton>,
    );
    const button = screen.getByTestId("copy");
    expect(button).toHaveClass("loam-Button", "mine");
    expect(button).toHaveAttribute("type", "button");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("x"));
  });

  it("does not copy when the consumer's onClick prevents default", async () => {
    const user = setup();
    render(<CopyButton value="x" onClick={(e) => e.preventDefault()} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).not.toHaveBeenCalled();
  });

  it("clears the revert timer on unmount", async () => {
    vi.useFakeTimers();
    stubClipboard();
    const { unmount } = render(<CopyButton value="x" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("has no axe violations at rest and while copied", async () => {
    const user = setup();
    const { container } = render(<CopyButton value="pnpm add @loamui/core" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: "Copy" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("has no axe violations as an icon-only button", async () => {
    const { container } = render(
      <CopyButton value="token" aria-label="Copy token">
        <svg aria-hidden />
      </CopyButton>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
