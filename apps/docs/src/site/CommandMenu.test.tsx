import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { CommandMenu } from "./CommandMenu";

/**
 * The palette is an APG editable combobox in a native dialog. What it has to
 * get right: the box keeps focus and points at an option, the arrow keys move
 * that pointer, Enter follows it — and, since the index carries each page's
 * prose, a phrase from a page's body finds the page.
 */
const INDEX = [
  {
    url: "/docs/accessibility",
    title: "Accessibility",
    description: "What LoamUI guarantees.",
    text: "Every control is reachable with forced-colors active.",
  },
  {
    url: "/docs/components/table",
    title: "Table",
    description: "Rows and columns.",
    text: "A sticky header keeps the column names in view.",
  },
];
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

function setup() {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => INDEX }));
  const view = render(<CommandMenu />);
  fireEvent.click(screen.getByRole("button", { name: "Search documentation" }));
  return view;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  push.mockClear();
});

describe("the command menu", () => {
  it("opens as a combobox that owns focus and points into a listbox", async () => {
    const { container } = setup();
    const box = screen.getByRole("combobox");
    expect(box).toHaveFocus();
    const list = screen.getByRole("listbox", { name: "Results" });
    expect(box).toHaveAttribute("aria-controls", list.id);
    expect(box.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[0]!.id,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("moves the pointer with the arrow keys without moving focus", () => {
    setup();
    const box = screen.getByRole("combobox");
    const [first, second] = screen.getAllByRole("option");
    fireEvent.keyDown(box, { key: "ArrowDown" });
    expect(box.getAttribute("aria-activedescendant")).toBe(second!.id);
    expect(box).toHaveFocus();
    fireEvent.keyDown(box, { key: "Home" });
    expect(box.getAttribute("aria-activedescendant")).toBe(first!.id);
  });

  it("finds a page by a phrase that only its body contains", async () => {
    setup();
    const box = screen.getByRole("combobox");
    fireEvent.change(box, { target: { value: "sticky header" } });
    // The index is fetched on first open; the result arrives after it.
    await waitFor(() => expect(screen.getByRole("option", { name: /Table/ })).toBeVisible());
    expect(screen.queryByRole("option", { name: /Accessibility/ })).toBeNull();
  });

  it("follows the pointed option on Enter", async () => {
    setup();
    const box = screen.getByRole("combobox");
    fireEvent.change(box, { target: { value: "forced-colors" } });
    await waitFor(() => expect(screen.getByRole("option", { name: /Accessibility/ })).toBeVisible());
    fireEvent.keyDown(box, { key: "Enter" });
    expect(push).toHaveBeenCalledWith("/docs/accessibility");
  });

  it("says so, as a status, when nothing matches", async () => {
    setup();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zzzz-no-such-page" } });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("No results"));
  });
});
