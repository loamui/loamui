import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { createRef } from "react";
import userEvent from "@testing-library/user-event";

import { Menu } from "../components/Menu/index.js";

afterEach(cleanup);

/**
 * The menu's keyboard model is the APG's, moving real focus between items
 * that rove with `tabIndex: -1`. The items are the Root's own collection, so
 * these cover what that collection has to get right: which items exist, which
 * are skipped, and the order they are painted in.
 */
function Actions(props: { disabled?: string[]; extra?: boolean }) {
  const off = new Set(props.disabled ?? []);
  return (
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Popup>
        <Menu.Item disabled={off.has("Rename")}>Rename</Menu.Item>
        {props.extra && <Menu.Item disabled={off.has("Duplicate")}>Duplicate</Menu.Item>}
        <Menu.Group>
          <Menu.GroupLabel>Danger</Menu.GroupLabel>
          <Menu.Item disabled={off.has("Archive")}>Archive</Menu.Item>
        </Menu.Group>
        <Menu.Item disabled={off.has("Delete")}>Delete</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  );
}

const names = () => screen.getAllByRole("menuitem").map((el) => el.textContent);

describe("Menu keyboard navigation", () => {
  it("opens on the trigger and puts focus on the first item", async () => {
    const user = userEvent.setup();
    render(<Actions />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
  });

  it("moves focus down and up, wrapping at both ends", async () => {
    const user = userEvent.setup();
    render(<Actions />);
    await user.click(screen.getByRole("button", { name: "Actions" }));

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Archive" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    // past the end, back to the first
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    // and backwards past the start, to the last
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
  });

  it("jumps to the ends with Home and End", async () => {
    const user = userEvent.setup();
    render(<Actions />);
    await user.click(screen.getByRole("button", { name: "Actions" }));

    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
  });

  it("counts an item nested in a Group as one of its own", async () => {
    const user = userEvent.setup();
    render(<Actions />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    // Nesting is the consumer's choice, so a grouped item is in the collection
    // on the same terms as an ungrouped one. (Painted order is what the
    // dynamic case below pins down: here mount order happens to match it.)
    expect(names()).toEqual(["Rename", "Archive", "Delete"]);
  });

  it("skips a disabled item, and never lands on it", async () => {
    const user = userEvent.setup();
    render(<Actions disabled={["Archive"]} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    expect(screen.getByRole("menuitem", { name: "Archive" })).not.toHaveFocus();
  });

  it("follows an item added after the menu first rendered", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Actions />);
    rerender(<Actions extra />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(names()).toEqual(["Rename", "Duplicate", "Archive", "Delete"]);

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
  });

  it("jumps to an item by typing its first letters", async () => {
    const user = userEvent.setup();
    render(<Actions />);
    await user.click(screen.getByRole("button", { name: "Actions" }));

    await user.keyboard("de");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
  });
});

describe("Menu composition", () => {
  it("composes the part and render target refs and cleans both up", () => {
    const partRef = createRef<HTMLButtonElement>();
    const targetRef = createRef<HTMLButtonElement>();
    const { unmount } = render(
      <Menu.Root>
        <Menu.Popup>
          <Menu.Item ref={partRef} render={<button ref={targetRef} />}>
            Rename
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    expect(partRef.current).toBe(screen.getByText("Rename"));
    expect(targetRef.current).toBe(partRef.current);
    unmount();
    expect(partRef.current).toBeNull();
    expect(targetRef.current).toBeNull();
  });

  it("navigates to the current element when an item changes from button to link", async () => {
    function Example({ href }: { href?: string }) {
      return (
        <Menu.Root>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Popup>
            <Menu.Item href={href}>First</Menu.Item>
            <Menu.Item>Second</Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      );
    }
    const { rerender } = render(<Example />);
    rerender(<Example href="/target" />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
    await user.keyboard("{ArrowDown}{Home}");
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
  });
});
