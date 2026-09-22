import { describe, it, expect, afterEach, vi } from "vitest";
import { useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Price,
  Switch,
  Checkbox,
  Tabs,
  Details,
  ErrorSummary,
  Menu,
  Modal,
  Drawer,
  Popover,
  Toast,
  Toasts,
  useToast,
  Tooltip,
  Button,
  SignpostLink,
  Pagination,
  DateInput,
  Breadcrumbs,
  Card,
  Table,
  SkipLink,
  Textarea,
  Field,
} from "../index.js";
import type { ToastOptions } from "../index.js";

afterEach(cleanup);

describe("Switch", () => {
  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(
      <Field.Item>
        <Field.Label>
          <Switch.Root>
            <Switch.Control />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          Notifications
        </Field.Label>
      </Field.Item>,
    );
    const sw = screen.getByRole("switch") as HTMLInputElement;
    expect(sw.checked).toBe(false);
    await user.click(sw);
    expect(sw.checked).toBe(true);
  });
});

describe("Checkbox", () => {
  it("reflects the indeterminate prop on the DOM node", () => {
    render(
      <Field.Item>
        <Field.Label>
          <Checkbox indeterminate /> Select all
        </Field.Label>
      </Field.Item>,
    );
    const cb = screen.getByRole("checkbox") as HTMLInputElement;
    expect(cb.indeterminate).toBe(true);
  });
});

describe("Tabs", () => {
  it("switches panels on click and supports arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Account</Tabs.Tab>
          <Tabs.Tab value="b">Security</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Account panel</Tabs.Panel>
        <Tabs.Panel value="b">Security panel</Tabs.Panel>
      </Tabs.Root>,
    );
    // Inactive panels stay mounted but hidden (preserves state).
    expect(screen.getByText("Account panel")).toBeVisible();
    expect(screen.getByText("Security panel")).not.toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Security" }));
    expect(screen.getByText("Security panel")).toBeVisible();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
  });

  it("falls back to the first enabled tab when an uncontrolled value is stale", async () => {
    render(
      <Tabs.Root defaultValue="missing">
        <Tabs.List>
          <Tabs.Tab value="disabled" disabled>
            Disabled
          </Tabs.Tab>
          <Tabs.Tab value="first">First available</Tabs.Tab>
          <Tabs.Tab value="second">Second available</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="disabled">Disabled panel</Tabs.Panel>
        <Tabs.Panel value="first">First panel</Tabs.Panel>
        <Tabs.Panel value="second">Second panel</Tabs.Panel>
      </Tabs.Root>,
    );

    await waitFor(() =>
      expect(screen.getByRole("tab", { name: "First available" })).toHaveAttribute(
        "aria-selected",
        "true",
      ),
    );
    expect(screen.getByText("First panel")).toBeVisible();
  });

  it("reverses horizontal arrow movement in right-to-left content", async () => {
    const user = userEvent.setup();
    render(
      <div dir="rtl">
        <Tabs.Root defaultValue="b">
          <Tabs.List>
            <Tabs.Tab value="a">Alpha</Tabs.Tab>
            <Tabs.Tab value="b">Beta</Tabs.Tab>
            <Tabs.Tab value="c">Gamma</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="a">Alpha panel</Tabs.Panel>
          <Tabs.Panel value="b">Beta panel</Tabs.Panel>
          <Tabs.Panel value="c">Gamma panel</Tabs.Panel>
        </Tabs.Root>
      </div>,
    );

    screen.getByRole("tab", { name: "Beta" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("Details", () => {
  it("expands on summary click", async () => {
    const user = userEvent.setup();
    render(
      <Details.Root>
        <Details.Summary>Question</Details.Summary>
        <Details.Content>Answer text</Details.Content>
      </Details.Root>,
    );
    const details = screen.getByText("Question").closest("details")!;
    expect(details.open).toBe(false);
    await user.click(screen.getByText("Question"));
    expect(details.open).toBe(true);
  });

  it("a shared name reaches the native attribute (the browser owns exclusivity)", () => {
    // jsdom does not model exclusive <details name>; asserting the
    // attribute is wired is the testable part.
    render(
      <>
        <Details.Root name="set" defaultOpen>
          <Details.Summary>First</Details.Summary>
          <Details.Content>one</Details.Content>
        </Details.Root>
        <Details.Root name="set">
          <Details.Summary>Second</Details.Summary>
          <Details.Content>two</Details.Content>
        </Details.Root>
      </>,
    );
    expect(screen.getByText("First").closest("details")).toHaveAttribute("name", "set");
    expect(screen.getByText("Second").closest("details")).toHaveAttribute("name", "set");
  });
});

/*
 * jsdom implements <dialog> (show/showModal/close and the close event) but
 * not UA behaviors: Escape, closedby light dismiss, and focus-restore run in
 * a real browser only — they're covered by the Storybook play test.
 */
describe("controlled overlays", () => {
  function ControlledModal() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open it</Button>
        <Modal.Root open={open} onOpenChange={setOpen}>
          <Modal.Popup>
            <Modal.Title>Controlled</Modal.Title>
            <Modal.Close>Close</Modal.Close>
          </Modal.Popup>
        </Modal.Root>
      </>
    );
  }

  it("Modal follows the open prop and reports closes through onOpenChange", async () => {
    const user = userEvent.setup();
    render(<ControlledModal />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open it" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // A native close (Escape, backdrop) fires the dialog's close event; the
    // reconcile must report it upward instead of re-opening the dialog.
    fireEvent(screen.getByRole("dialog"), new Event("close"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  function ControlledPopover() {
    const [open, setOpen] = useState(false);
    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>Filters</Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Filters</Popover.Title>
          <Popover.Close>Done</Popover.Close>
        </Popover.Popup>
      </Popover.Root>
    );
  }

  it("Popover round-trips open state through the trigger and Close", async () => {
    const user = userEvent.setup();
    render(<ControlledPopover />);
    const trigger = screen.getByRole("button", { name: "Filters" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  });
});

describe("Modal", () => {
  function ModalDemo() {
    return (
      <Modal.Root>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Popup>
          <Modal.Title>Hello</Modal.Title>
          <Modal.Description>Modal body</Modal.Description>
          <Modal.Close>Done</Modal.Close>
        </Modal.Popup>
      </Modal.Root>
    );
  }

  it("opens from its trigger and closes via the Close part", async () => {
    const user = userEvent.setup();
    render(<ModalDemo />);
    const trigger = screen.getByRole("button", { name: "Open" });
    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(false);
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(dialog.open).toBe(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-popup-open", "true");
    expect(dialog).toHaveAttribute("data-open");
    expect(dialog).toHaveAccessibleName("Hello");
    expect(dialog).toHaveAccessibleDescription("Modal body");

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(dialog.open).toBe(false));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("data-popup-open");
  });

  it("lists the Title and Description ids before the consumer's, each once", () => {
    render(
      <>
        <p id="notice">Read this first.</p>
        <Modal.Root>
          <Modal.Popup aria-labelledby="notice" aria-describedby="notice notice">
            <Modal.Title>Hello</Modal.Title>
            <Modal.Description>Modal body</Modal.Description>
          </Modal.Popup>
        </Modal.Root>
      </>,
    );
    const dialog = document.querySelector("dialog")!;
    const titleId = screen.getByText("Hello").id;
    const descriptionId = screen.getByText("Modal body").id;
    expect(dialog).toHaveAttribute("aria-labelledby", `${titleId} notice`);
    expect(dialog).toHaveAttribute("aria-describedby", `${descriptionId} notice`);
  });

  it("syncs native close events back into state", async () => {
    const user = userEvent.setup();
    render(<ModalDemo />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(true);

    // A native close (Escape / light dismiss / method="dialog" all funnel
    // here) must update React state, reflected in the trigger's hook.
    dialog.close();
    await waitFor(() => expect(trigger).not.toHaveAttribute("data-popup-open"));
  });
});

describe("Drawer", () => {
  function DrawerDemo() {
    return (
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Popup side="end">
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.Description>Drawer body</Drawer.Description>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Popup>
      </Drawer.Root>
    );
  }

  it("opens from its trigger, reflecting its side, and closes via Close", async () => {
    const user = userEvent.setup();
    render(<DrawerDemo />);
    const trigger = screen.getByRole("button", { name: "Open" });
    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(false);
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(dialog.open).toBe(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-popup-open", "true");
    expect(dialog).toHaveAttribute("data-side", "end");
    expect(dialog).toHaveAccessibleName("Filters");
    expect(dialog).toHaveAccessibleDescription("Drawer body");

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(dialog.open).toBe(false));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("data-popup-open");
  });

  it("syncs native close events back into state", async () => {
    const user = userEvent.setup();
    render(<DrawerDemo />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(true);

    dialog.close();
    await waitFor(() => expect(trigger).not.toHaveAttribute("data-popup-open"));
  });
});

/*
 * jsdom implements neither the popover API nor CSS anchor positioning, so
 * these suites exercise the components' fallback path (hidden attribute + JS
 * dismiss handling). The enhanced top-layer path is covered by the Storybook
 * play tests, which run in a real browser.
 */

describe("ErrorSummary", () => {
  it("takes focus when it appears and moves focus to a field on activation", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ErrorSummary.Root>
          <ErrorSummary.Title />
          <ErrorSummary.List>
            <ErrorSummary.Item href="#email-field">Enter your email address</ErrorSummary.Item>
          </ErrorSummary.List>
        </ErrorSummary.Root>
        <input id="email-field" aria-label="Email" />
      </>,
    );
    const region = screen.getByRole("group", { name: "There is a problem" });
    await waitFor(() => expect(region).toHaveFocus());
    await user.click(screen.getByRole("link", { name: "Enter your email address" }));
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Email" })).toHaveFocus());
  });
});

describe("Menu", () => {
  function renderMenu(onDelete = () => {}) {
    return render(
      <Menu.Root>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item>Rename</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Item onClick={onDelete}>Delete</Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
  }

  it("opens on click, focuses the first item, and closes on item activation", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderMenu(onDelete);

    await user.click(screen.getByRole("button", { name: "Options" }));
    const menu = screen.getByRole("menu");
    expect(menu).toBeVisible();
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus());

    await user.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Options" })).toHaveFocus();
  });

  it("roves focus with arrow keys, loops, and supports Home/End", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Options" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus());

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await user.keyboard("{ArrowDown}"); // loops
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    await user.keyboard("{ArrowUp}"); // loops back
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
  });

  it("jumps to items by typing (typeahead)", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Options" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus());
    await user.keyboard("d");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menu")).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Options" })).toHaveFocus();
  });

  it("opens from the trigger with ArrowUp focusing the last item", async () => {
    const user = userEvent.setup();
    renderMenu();
    screen.getByRole("button", { name: "Options" }).focus();
    await user.keyboard("{ArrowUp}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus());
  });

  it("toggles a CheckboxItem and keeps the menu open", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Menu.Root>
        <Menu.Trigger>View</Menu.Trigger>
        <Menu.Popup>
          <Menu.CheckboxItem onCheckedChange={onCheckedChange}>Show hidden</Menu.CheckboxItem>
        </Menu.Popup>
      </Menu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "View" }));
    const item = screen.getByRole("menuitemcheckbox", { name: "Show hidden" });
    await waitFor(() => expect(item).toHaveFocus());
    expect(item).toHaveAttribute("aria-checked", "false");
    await user.click(item);
    expect(item).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("menu")).toBeVisible();
  });

  it("selects one RadioItem of a RadioGroup and roves through them", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Menu.Root>
        <Menu.Trigger>Sort</Menu.Trigger>
        <Menu.Popup>
          <Menu.RadioGroup defaultValue="name" onValueChange={onValueChange}>
            <Menu.GroupLabel>Sort by</Menu.GroupLabel>
            <Menu.RadioItem value="name">Name</Menu.RadioItem>
            <Menu.RadioItem value="date">Date</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Sort" }));
    expect(screen.getByRole("group", { name: "Sort by" })).toBeInTheDocument();
    const name = screen.getByRole("menuitemradio", { name: "Name" });
    const date = screen.getByRole("menuitemradio", { name: "Date" });
    await waitFor(() => expect(name).toHaveFocus());
    expect(name).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowDown}");
    expect(date).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(date).toHaveAttribute("aria-checked", "true");
    expect(name).toHaveAttribute("aria-checked", "false");
    expect(onValueChange).toHaveBeenLastCalledWith("date");
  });

  it("skips disabled items when roving", async () => {
    const user = userEvent.setup();
    render(
      <Menu.Root>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item>One</Menu.Item>
          <Menu.Item disabled>Two</Menu.Item>
          <Menu.Item>Three</Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Options" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "One" })).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Three" })).toHaveFocus();
  });
});

describe("Toast", () => {
  function FireButton(props: { options?: Partial<ToastOptions> }) {
    const toast = useToast();
    return (
      <Button onClick={() => toast.add({ title: "Saved", description: "Done.", ...props.options })}>
        Fire
      </Button>
    );
  }

  it("announces via role=status and dismisses from the close button", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider>
        <FireButton />
        <Toasts />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Fire" }));
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Saved");
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("uses role=alert for high priority", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider>
        <FireButton options={{ priority: "high" }} />
        <Toasts />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Fire" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("auto-dismisses after its timeout", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider timeout={40}>
        <FireButton />
        <Toasts />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Fire" }));
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  });

  it("pauses the dismiss timer while hovered and resumes with remaining time", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider timeout={80}>
        <FireButton />
        <Toasts />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Fire" }));
    const status = screen.getByRole("status");
    const viewport = status.closest("[aria-label]") as HTMLElement;

    // Hover before the timeout lands; the toast must outlive its 80ms.
    fireEvent.pointerEnter(viewport);
    await new Promise((r) => setTimeout(r, 160));
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Leaving resumes the countdown from the remaining time.
    fireEvent.pointerLeave(viewport);
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  });

  it("keeps a persistent toast (timeout: 0) until dismissed", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider timeout={30}>
        <FireButton options={{ timeout: 0 }} />
        <Toasts />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Fire" }));
    await new Promise((r) => setTimeout(r, 80));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("drops the oldest toast past the limit", async () => {
    const user = userEvent.setup();
    function FireMany() {
      const toast = useToast();
      return <Button onClick={() => toast.add({ description: "another" })}>Fire</Button>;
    }
    render(
      <Toast.Provider limit={2} timeout={0}>
        <FireMany />
        <Toasts />
      </Toast.Provider>,
    );
    const fire = screen.getByRole("button", { name: "Fire" });
    await user.click(fire);
    await user.click(fire);
    await user.click(fire);
    expect(screen.getAllByRole("status")).toHaveLength(2);
  });

  it("speaks the consumer's words for the region and the dismiss button", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider>
        <FireButton />
        <Toasts labels={{ region: "Meldungen", dismiss: "Schließen" }} />
      </Toast.Provider>,
    );
    expect(screen.getByRole("region", { name: "Meldungen" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Fire" }));
    const dismiss = screen.getByRole("button", { name: "Schließen" });
    expect(dismiss).toHaveClass("loam-Button");
    await user.click(dismiss);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("composed parts read their toast from the Root", async () => {
    const user = userEvent.setup();
    function Viewport() {
      const { toasts } = useToast();
      return (
        <Toast.Viewport>
          {toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <Toast.Title render={<strong />}>{toast.title}</Toast.Title>
              <Toast.Description render={<p />}>{toast.description}</Toast.Description>
              <Toast.Close render={<button />}>Bye</Toast.Close>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      );
    }
    render(
      <Toast.Provider>
        <FireButton />
        <Viewport />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Fire" }));
    const status = screen.getByRole("status");
    expect(status.querySelector("strong.title")).toHaveTextContent("Saved");
    expect(status.querySelector("p.description")).toHaveTextContent("Done.");
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("runs the action and dismisses", async () => {
    const user = userEvent.setup();
    const undo = vi.fn();
    function FireAction() {
      const toast = useToast();
      return (
        <Button
          onClick={() =>
            toast.add({
              description: "Deleted",
              timeout: 0,
              action: { label: "Undo", onClick: undo },
            })
          }
        >
          Fire
        </Button>
      );
    }
    render(
      <Toast.Provider>
        <FireAction />
        <Toasts />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Fire" }));
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalledOnce();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

describe("Modal (invoker commands)", () => {
  it("renders declarative commandfor/command wiring when the API exists", async () => {
    // jsdom has no Invoker Commands API — simulate the probe the component
    // uses ('commandForElement' in HTMLButtonElement.prototype).
    Object.defineProperty(HTMLButtonElement.prototype, "commandForElement", {
      configurable: true,
      value: null,
    });
    try {
      render(
        <Modal.Root>
          <Modal.Trigger>Open</Modal.Trigger>
          <Modal.Popup>
            <Modal.Title>Hi</Modal.Title>
            <Modal.Close>Done</Modal.Close>
          </Modal.Popup>
        </Modal.Root>,
      );
      const trigger = screen.getByRole("button", { name: "Open" });
      await waitFor(() => expect(trigger).toHaveAttribute("command", "show-modal"));
      const dialogId = trigger.getAttribute("commandfor");
      expect(dialogId).toBeTruthy();
      // The Close lives inside the (closed, hence aria-hidden) dialog.
      const done = screen.getByRole("button", { name: "Done", hidden: true });
      expect(done).toHaveAttribute("command", "close");
      expect(done).toHaveAttribute("commandfor", dialogId as string);
    } finally {
      delete (HTMLButtonElement.prototype as { commandForElement?: unknown }).commandForElement;
    }
  });

  it("falls back to onClick wiring without the API", async () => {
    const user = userEvent.setup();
    render(
      <Modal.Root>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Popup>
          <Modal.Title>Hi</Modal.Title>
          <Modal.Close>Done</Modal.Close>
        </Modal.Popup>
      </Modal.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).not.toHaveAttribute("command");
    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});

describe("Modal (naming)", () => {
  it("reports a Popup with no Title and no aria-label in development, once it opens", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const { rerender } = render(
        <Modal.Root open={false}>
          <Modal.Popup>
            <Modal.Close>Done</Modal.Close>
          </Modal.Popup>
        </Modal.Root>,
      );
      // Closed, the dialog is not read, and its name may still be on its way.
      expect(error).not.toHaveBeenCalled();
      rerender(
        <Modal.Root open>
          <Modal.Popup>
            <Modal.Close>Done</Modal.Close>
          </Modal.Popup>
        </Modal.Root>,
      );
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining("<Modal.Popup> has no accessible name"),
      );
      error.mockClear();
      cleanup();
      render(
        <Modal.Root open>
          <Modal.Popup aria-label="Filters">
            <Modal.Close>Done</Modal.Close>
          </Modal.Popup>
        </Modal.Root>,
      );
      expect(error).not.toHaveBeenCalled();
    } finally {
      error.mockRestore();
    }
  });

  it("applies the same check to a Drawer", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const { rerender } = render(
        <Drawer.Root open={false}>
          <Drawer.Popup>
            <Drawer.Close>Done</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Root>,
      );
      expect(error).not.toHaveBeenCalled();
      rerender(
        <Drawer.Root open>
          <Drawer.Popup>
            <Drawer.Close>Done</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Root>,
      );
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining("<Drawer.Popup> has no accessible name"),
      );
    } finally {
      error.mockRestore();
    }
  });
});

describe("Modal (alert variant)", () => {
  it("renders role=alertdialog with closerequest dismissal", async () => {
    const user = userEvent.setup();
    render(
      <Modal.Root>
        <Modal.Trigger>Delete file</Modal.Trigger>
        <Modal.Popup alert>
          <Modal.Title>Delete this file?</Modal.Title>
          <Modal.Description>This cannot be undone.</Modal.Description>
          <Modal.Close autoFocus>Cancel</Modal.Close>
          <Modal.Close>Delete</Modal.Close>
        </Modal.Popup>
      </Modal.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Delete file" }));
    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toHaveAttribute("closedby", "closerequest");
    // Initial focus on the autoFocus (least-destructive) action is native
    // showModal behaviour — real browsers do it; the jsdom shim doesn't, so
    // it is covered by the Storybook interaction suite instead.
  });
});

describe("Popover", () => {
  function PopoverDemo() {
    return (
      <div>
        <Popover.Root>
          <Popover.Trigger>Toggle</Popover.Trigger>
          <Popover.Popup>Popover body</Popover.Popup>
        </Popover.Root>
        <button>outside</button>
      </div>
    );
  }

  it("opens on trigger click and closes on outside click", async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(screen.getByText("Popover body")).not.toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(screen.getByText("Popover body")).toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Shared styling hooks: the state-attribute contract.
    expect(trigger).toHaveAttribute("data-popup-open", "true");
    expect(screen.getByText("Popover body")).toHaveAttribute("data-open");

    await user.click(screen.getByRole("button", { name: "outside" }));
    await waitFor(() => expect(screen.getByText("Popover body")).not.toBeVisible());
    expect(trigger).not.toHaveAttribute("data-popup-open");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<PopoverDemo />);
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.getByText("Popover body")).toBeVisible();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.getByText("Popover body")).not.toBeVisible());
  });

  it("lists the Title's id before a consumer's aria-labelledby, each id once", () => {
    render(
      <>
        <p id="notice">Notice</p>
        <Popover.Root defaultOpen>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Popup aria-labelledby="notice" aria-describedby="notice notice">
            <Popover.Title>Filters</Popover.Title>
            <Popover.Description>Narrow the list.</Popover.Description>
          </Popover.Popup>
        </Popover.Root>
      </>,
    );
    const dialog = screen.getByRole("dialog");
    const titleId = screen.getByText("Filters").id;
    const descriptionId = screen.getByText("Narrow the list.").id;
    expect(dialog).toHaveAttribute("aria-labelledby", `${titleId} notice`);
    expect(dialog).toHaveAttribute("aria-describedby", `${descriptionId} notice`);
  });

  it("opens via a render-composed trigger and keeps focus restoration", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger render={<Button>Menu</Button>} />
        <Popover.Popup>
          <Popover.Close>Done</Popover.Close>
        </Popover.Popup>
      </Popover.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    expect(trigger).toHaveClass("loam-Button");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Ref composition: closing from inside restores focus to the real Button.
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(trigger).toHaveFocus();
  });

  it("moves focus into the panel on open and restores it on close", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Popup>
          <Popover.Close>Done</Popover.Close>
        </Popover.Popup>
      </Popover.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    const popup = screen.getByRole("dialog");
    expect(popup).toHaveFocus();

    // Closing from inside returns focus to the trigger (WCAG 2.4.3).
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(popup).not.toBeVisible();
    expect(trigger).toHaveFocus();
  });

  it("labels the popup from its Title and Description parts", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Popup side="top">
          <Popover.Title render={<h3 />}>Settings</Popover.Title>
          <Popover.Description>Preferences panel.</Popover.Description>
        </Popover.Popup>
      </Popover.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const popup = screen.getByRole("dialog");
    expect(popup).toHaveAccessibleName("Settings");
    expect(popup).toHaveAccessibleDescription("Preferences panel.");
    expect(popup).toHaveAttribute("data-side", "top");
    expect(screen.getByRole("heading", { level: 3, name: "Settings" })).toHaveClass("title");
  });
});

describe("Tooltip", () => {
  function TooltipDemo({ delay }: { delay?: number }) {
    return (
      <Tooltip.Root delay={delay}>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Popup>Saves your changes</Tooltip.Popup>
      </Tooltip.Root>
    );
  }

  it("statically links the trigger via aria-describedby (render form)", () => {
    render(
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button>Save</Button>} />
        <Tooltip.Popup>Saves your changes</Tooltip.Popup>
      </Tooltip.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Save" });
    const bubble = screen.getByText("Saves your changes");
    expect(trigger).toHaveAttribute("aria-describedby", bubble.id);
    expect(bubble).not.toBeVisible();
  });

  it("reveals immediately on keyboard focus and hides on blur", async () => {
    const user = userEvent.setup();
    render(<TooltipDemo />);
    const bubble = screen.getByText("Saves your changes");

    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
    expect(bubble).toBeVisible();
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-popup-open", "true");
    expect(bubble).toHaveAttribute("data-open");

    await user.tab();
    expect(bubble).not.toBeVisible();
  });

  it("reveals on hover only after the delay", async () => {
    const user = userEvent.setup();
    render(<TooltipDemo delay={80} />);
    const bubble = screen.getByText("Saves your changes");

    await user.hover(screen.getByRole("button", { name: "Save" }));
    // Not shown synchronously — the open is delayed.
    expect(bubble).not.toBeVisible();
    await waitFor(() => expect(bubble).toBeVisible());
  });

  it("stays open for a focused trigger while a pointer passes over and away", async () => {
    const user = userEvent.setup();
    render(<TooltipDemo />);
    const trigger = screen.getByRole("button", { name: "Save" });
    const bubble = screen.getByText("Saves your changes");

    await user.tab();
    expect(bubble).toBeVisible();

    // A pointer sweeping across the trigger must not steal the bubble from
    // the still-focused keyboard user (WCAG 1.4.13 persistent).
    await user.hover(trigger);
    await user.unhover(trigger);
    await new Promise((r) => setTimeout(r, 400));
    expect(bubble).toBeVisible();
  });

  it("dismisses on Escape without moving focus (WCAG 1.4.13)", async () => {
    const user = userEvent.setup();
    render(<TooltipDemo />);
    const trigger = screen.getByRole("button", { name: "Save" });
    const bubble = screen.getByText("Saves your changes");

    await user.tab();
    expect(bubble).toBeVisible();

    await user.keyboard("{Escape}");
    expect(bubble).not.toBeVisible();
    expect(trigger).toHaveFocus();
    // The description link survives dismissal.
    expect(trigger).toHaveAttribute("aria-describedby", bubble.id);
  });
});

describe("SignpostLink", () => {
  it("render substitutes the element and merges the class and children", () => {
    render(
      <SignpostLink render={<a href="/apply" data-router-link />}>
        Start your application
      </SignpostLink>,
    );
    const link = screen.getByRole("link", { name: "Start your application" });
    expect(link).toHaveAttribute("data-router-link");
    expect(link).toHaveClass("loam-SignpostLink");
  });

  it("the arrow anatomy becomes the substituted element's children", () => {
    render(<SignpostLink render={<a href="/apply" />}>Start your application</SignpostLink>);
    const link = screen.getByRole("link", { name: "Start your application" });
    expect(link.querySelector("span.icon svg")).not.toBeNull();
    expect(link.querySelector("span.label")).toHaveTextContent("Start your application");
  });

  it("an element's own children win, per the merge contract", () => {
    render(<SignpostLink render={<a href="/apply">Start your application</a>} />);
    const link = screen.getByRole("link", { name: "Start your application" });
    expect(link.querySelector("span.label")).toBeNull();
  });
});

describe("composition contract regressions", () => {
  it("Menu.Item render merges children, className and rest", async () => {
    const user = userEvent.setup();
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item render={<a href="/settings" data-router-link />} className="danger">
            Settings
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    const item = screen.getByRole("menuitem", { name: "Settings" });
    expect(item).toHaveAttribute("data-router-link");
    expect(item).toHaveAttribute("href", "/settings");
    expect(item.className).toContain("danger");
    expect(item.className).toContain("item");
    void user;
  });

  it("Popover.Popup forwards a consumer ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Popup ref={ref}>Panel</Popover.Popup>
      </Popover.Root>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.getAttribute("role")).toBe("dialog");
  });
});

describe("Pagination", () => {
  const href = (page: number) => `/results?page=${page}`;
  function Pager(props: { page: number; count: number; onNavigate?: (page: number) => void }) {
    return (
      <Pagination.Root>
        <Pagination.List>
          <Pagination.Pages
            page={props.page}
            count={props.count}
            getHref={href}
            onNavigate={(page, event) => {
              event.preventDefault();
              props.onNavigate?.(page);
            }}
          />
        </Pagination.List>
      </Pagination.Root>
    );
  }

  it("windows pages around the active one with ellipses", () => {
    render(<Pager page={5} count={10} />);
    for (const page of ["1", "4", "5", "6", "10"]) {
      expect(screen.getByRole("link", { name: `Page ${page}` })).toHaveAttribute(
        "href",
        `/results?page=${page}`,
      );
    }
    expect(screen.queryByRole("link", { name: "Page 2" })).toBeNull();
    expect(screen.getByRole("link", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("exposes prev/next relationships and lets client routers intercept navigation", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Pager page={5} count={10} onNavigate={onNavigate} />);
    await user.click(screen.getByRole("link", { name: "Page 6" }));
    expect(onNavigate).toHaveBeenLastCalledWith(6);
    const previous = screen.getByRole("link", { name: "Previous page" });
    expect(previous).toHaveAttribute("rel", "prev");
    expect(previous).toHaveClass("loam-Button");
    await user.click(previous);
    expect(onNavigate).toHaveBeenLastCalledWith(4);
    expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute("rel", "next");
  });

  it("renders boundary placeholders outside the tab and accessibility order", () => {
    const { container } = render(<Pager page={1} count={3} />);
    expect(screen.queryByRole("link", { name: "Previous page" })).toBeNull();
    const placeholder = container.querySelector("[data-disabled]");
    expect(placeholder).toHaveAttribute("aria-hidden", "true");
    expect(placeholder).not.toHaveAttribute("href");
  });

  it("speaks the consumer's words and takes router links through render", () => {
    render(
      <Pagination.Root labels={{ navigation: "Seiten" }}>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Link
              render={<a href="/first" data-router-link />}
              aria-label="Erste Seite"
            />
          </Pagination.Item>
          <Pagination.Pages
            page={2}
            count={3}
            getHref={href}
            labels={{ previous: "Zurück", next: "Weiter", page: (n) => `Seite ${n}` }}
          />
          <Pagination.Ellipsis />
        </Pagination.List>
      </Pagination.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Seiten" })).toBeInTheDocument();
    const first = screen.getByRole("link", { name: "Erste Seite" });
    expect(first).toHaveAttribute("data-router-link");
    expect(first).toHaveClass("loam-Button");
    expect(screen.getByRole("link", { name: "Zurück" })).toHaveAttribute("href", "/results?page=1");
    expect(screen.getByRole("link", { name: "Seite 2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("…")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("DateInput", () => {
  it("renders only the requested parts, each labelled", () => {
    render(
      <DateInput.Root name="expiry">
        <DateInput.Legend>Expiry date</DateInput.Legend>
        <DateInput.Fields>
          <DateInput.Month />
          <DateInput.Year />
        </DateInput.Fields>
      </DateInput.Root>,
    );
    expect(screen.getByLabelText("Month")).toHaveAttribute("name", "expiry-month");
    expect(screen.getByLabelText("Year")).toHaveAttribute("name", "expiry-year");
    expect(screen.queryByLabelText("Day")).toBeNull();
  });

  it("an error narrowed with parts marks only those fields invalid", () => {
    render(
      <DateInput.Root invalid={["year"]} name="dob">
        <DateInput.Legend>Date of birth</DateInput.Legend>
        <DateInput.Error>The year must include four digits</DateInput.Error>
        <DateInput.Fields>
          <DateInput.Day />
          <DateInput.Month />
          <DateInput.Year />
        </DateInput.Fields>
      </DateInput.Root>,
    );
    expect(screen.getByLabelText("Year")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Day")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByLabelText("Month")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("alert")).toHaveTextContent("The year must include four digits");
  });

  it("bday autofill maps to per-part tokens", () => {
    render(
      <DateInput.Root name="dob" autoComplete="bday">
        <DateInput.Legend>Date of birth</DateInput.Legend>
        <DateInput.Fields>
          <DateInput.Day />
          <DateInput.Year />
        </DateInput.Fields>
      </DateInput.Root>,
    );
    expect(screen.getByLabelText("Day")).toHaveAttribute("autocomplete", "bday-day");
    expect(screen.getByLabelText("Year")).toHaveAttribute("autocomplete", "bday-year");
  });
});

describe("Breadcrumbs", () => {
  it("marks the current item and keeps the others as links", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((e: ReactMouseEvent) => e.preventDefault());
    render(
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href="/" onClick={onClick}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Billing</Breadcrumbs.Item>
      </Breadcrumbs.Root>,
    );
    const home = screen.getByRole("link", { name: "Home" });
    await user.tab();
    expect(home).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Billing")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Billing" })).toBeNull();
  });

  it("lands ref and rest on the item and takes the link through render", () => {
    const ref = { current: null as HTMLLIElement | null };
    render(
      <Breadcrumbs.Root labels={{ navigation: "Pfad" }}>
        <Breadcrumbs.Item ref={ref} className="mine" render={<a href="/" data-router-link />}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Billing</Breadcrumbs.Item>
      </Breadcrumbs.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Pfad" })).toBeInTheDocument();
    expect(ref.current).toHaveClass("loam-Breadcrumbs-item", "mine");
    const home = screen.getByRole("link", { name: "Home" });
    expect(home).toHaveAttribute("data-router-link");
    expect(ref.current).toContainElement(home);
  });
});

describe("Card", () => {
  it("forwards its ref and merges the consumer's attributes onto the surface", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Card ref={ref} aria-label="Invoice" className="mine">
        Body
      </Card>,
    );
    const card = screen.getByText("Body");
    expect(card).toHaveClass("loam-Card", "mine");
    expect(card).toHaveAttribute("aria-label", "Invoice");
    expect(ref.current).toBe(card);
  });
});

describe("Table", () => {
  const table = (
    <Table.Root>
      <Table.Caption>Invoices</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Invoice</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>INV-1</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table.Root>
  );

  it("adds no tab stop while the table fits its container", async () => {
    const user = userEvent.setup();
    render(
      <>
        {table}
        <button>After</button>
      </>,
    );
    expect(screen.queryByRole("region")).toBeNull();
    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("puts ref, className and rest on the scroll wrapper and tableProps on the table", () => {
    const ref = { current: null as HTMLDivElement | null };
    const tableRef = { current: null as HTMLTableElement | null };
    const { container } = render(
      <Table.Root
        ref={ref}
        className="mine"
        data-testid="wrap"
        tableProps={{ ref: tableRef, id: "t" }}
      >
        <Table.Caption>Invoices</Table.Caption>
      </Table.Root>,
    );
    const wrap = container.querySelector(".loam-Table");
    expect(wrap).toHaveClass("mine");
    expect(wrap).toHaveAttribute("data-testid", "wrap");
    expect(ref.current).toBe(wrap);
    expect(tableRef.current).toBe(container.querySelector("table#t"));
  });

  it("names an overflowing captionless table with the consumer's words", async () => {
    const scrollWidth = vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(800);
    const clientWidth = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(400);
    try {
      render(
        <Table.Root labels={{ scrollable: "Tabelle" }}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>INV-1</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table.Root>,
      );
      expect(await screen.findByRole("region", { name: "Tabelle" })).toBeInTheDocument();
    } finally {
      scrollWidth.mockRestore();
      clientWidth.mockRestore();
    }
  });

  it("becomes a focusable region named by its caption when it overflows", async () => {
    const user = userEvent.setup();
    // jsdom has no layout: report an overflowing scroll box for this test.
    const scrollWidth = vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(800);
    const clientWidth = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(400);
    try {
      render(table);
      const region = await screen.findByRole("region", { name: "Invoices" });
      expect(region).toHaveAttribute("tabindex", "0");
      await user.tab();
      expect(region).toHaveFocus();
    } finally {
      scrollWidth.mockRestore();
      clientWidth.mockRestore();
    }
  });
});

describe("SkipLink", () => {
  it("is the first tab stop and moves focus to the target", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink href="#content" />
        <a href="/">Home</a>
        <main id="content" tabIndex={-1}>
          Main
        </main>
      </>,
    );
    await user.tab();
    const skip = screen.getByRole("link", { name: "Skip to main content" });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute("href", "#content");
  });
});

describe("Textarea", () => {
  it("self-wires from Field and accepts typed input", async () => {
    const user = userEvent.setup();
    render(
      <Field.Root>
        <Field.Label>Message</Field.Label>
        <Field.Description>Keep it short.</Field.Description>
        <Textarea />
      </Field.Root>,
    );
    const area = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    expect(area).toHaveAccessibleDescription("Keep it short.");
    await user.type(area, "Hello");
    expect(area.value).toBe("Hello");
  });

  it("makes rows real: the attribute and the floor the stylesheet reads agree", () => {
    render(<Textarea aria-label="Notes" rows={6} />);
    const area = screen.getByLabelText("Notes") as HTMLTextAreaElement;
    expect(area).toHaveAttribute("rows", "6");
    expect(area.style.getPropertyValue("--_rows")).toBe("6");
  });
});

describe("Price", () => {
  it("writes the amount for people and keeps the number for machines", () => {
    const { container } = render(
      <Price value={24} currency="GBP">
        per seat, per month
      </Price>,
    );
    const data = container.querySelector("data")!;
    expect(data).toHaveClass("loam-Price");
    expect(data).toHaveAttribute("value", "24");
    expect(data.firstChild).toHaveTextContent("£24");
    expect(data.querySelector("small.per")).toHaveTextContent("per seat, per month");
  });

  it("drops the zeros of a whole amount and keeps a fraction's", () => {
    const { container } = render(
      <>
        <Price value={24} currency="GBP" />
        <Price value={9.5} currency="GBP" />
      </>,
    );
    const [whole, fraction] = Array.from(container.querySelectorAll("data"));
    expect(whole).toHaveTextContent(/^£24$/);
    expect(fraction).toHaveTextContent(/^£9\.50$/);
  });

  it("follows the locale it is given", () => {
    const { container } = render(<Price value={1250.5} currency="EUR" locale="de-DE" />);
    expect(container.querySelector("data")).toHaveTextContent("1.250,50 €");
  });

  it("renders no qualifier element when none is written", () => {
    const { container } = render(<Price value={24} currency="GBP" />);
    expect(container.querySelector("small")).toBeNull();
  });
});
