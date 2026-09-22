import { describe, it, expect, afterEach, afterAll, beforeAll, vi } from "vitest";
import { render, screen, cleanup, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nav } from "../components/Nav/index.js";

afterEach(cleanup);

// Colour contrast is covered live in Storybook; jsdom has no canvas for it.
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

function AppNav(props: { title?: boolean; open?: boolean; onOpenChange?: (o: boolean) => void }) {
  return (
    <Nav.Root>
      {props.title && <Nav.Title>Project</Nav.Title>}
      <Nav.List>
        <Nav.Item>
          <Nav.Link href="/">Dashboard</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/projects" current>
            Projects
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Group open={props.open} defaultOpen onOpenChange={props.onOpenChange}>
            <Nav.GroupTitle>Reports</Nav.GroupTitle>
            <Nav.List>
              <Nav.Item>
                <Nav.Link href="/reports/weekly">Weekly</Nav.Link>
              </Nav.Item>
            </Nav.List>
          </Nav.Group>
        </Nav.Item>
      </Nav.List>
    </Nav.Root>
  );
}

describe("Nav", () => {
  it("has no axe violations, titled and untitled", async () => {
    const titled = render(<AppNav title />);
    expect(await axe(titled.container, axeOptions)).toHaveNoViolations();
    titled.unmount();
    const untitled = render(<AppNav />);
    expect(await axe(untitled.container, axeOptions)).toHaveNoViolations();
  });

  it("is a landmark named by its Title, from the first render", () => {
    const html = renderToStaticMarkup(<AppNav title />);
    expect(html).toMatch(/<nav[^>]*aria-labelledby="([^"]+)"/);
    const id = html.match(/<nav[^>]*aria-labelledby="([^"]+)"/)?.[1];
    expect(html).toContain(`id="${id}"`);

    render(<AppNav title />);
    const nav = screen.getByRole("navigation", { name: "Project" });
    expect(nav).toHaveAttribute("aria-labelledby", screen.getByText("Project").id);
    expect(nav).not.toHaveAttribute("aria-label");
  });

  it("falls back to labels.navigation without a Title, and a consumer's name wins", () => {
    render(<AppNav />);
    const nav = screen.getByRole("navigation", { name: "Navigation" });
    expect(nav).not.toHaveAttribute("aria-labelledby");
    cleanup();

    render(
      <Nav.Root labels={{ navigation: "Menü" }}>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="/">Start</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Menü" })).toBeInTheDocument();
    cleanup();

    render(
      <Nav.Root aria-label="Site">
        <Nav.Title>Ignored for the name</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Site" })).not.toHaveAttribute("aria-labelledby");
  });

  it("renders the Title as a heading through render, keeping the id", () => {
    render(
      <Nav.Root>
        <Nav.Title render={<h2 />}>Product</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="/docs">Docs</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>,
    );
    const heading = screen.getByRole("heading", { level: 2, name: "Product" });
    expect(heading).toHaveClass("title");
    expect(screen.getByRole("navigation", { name: "Product" })).toHaveAttribute(
      "aria-labelledby",
      heading.id,
    );
  });

  it("marks the current destination with aria-current and keeps the list a list", () => {
    render(<AppNav />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
    expect(screen.getAllByRole("list").map((list) => list.tagName)).toEqual(["UL", "UL"]);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("says location for a table of contents, and nothing when current is false", () => {
    render(
      <Nav.Root>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#intro" current="location">
              Intro
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#usage" current={false}>
              Usage
            </Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>,
    );
    expect(screen.getByRole("link", { name: "Intro" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Usage" })).not.toHaveAttribute("aria-current");
  });

  it("substitutes the link through render and merges the wiring on", () => {
    const onClick = vi.fn((event: ReactMouseEvent<HTMLAnchorElement>) => event.preventDefault());
    render(
      <Nav.Root>
        <Nav.List>
          <Nav.Item>
            <Nav.Link
              render={<a data-router-link href="/settings" onClick={onClick} />}
              className="mine"
              current
            >
              Settings
            </Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>,
    );
    const link = screen.getByRole("link", { name: "Settings" });
    expect(link).toHaveAttribute("data-router-link");
    expect(link).toHaveAttribute("href", "/settings");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("link", "mine");
    link.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a Link as a button that keeps the link class and sheds the button dressing", () => {
    const onClick = vi.fn();
    render(
      <Nav.Root>
        <Nav.List>
          <Nav.Item>
            <Nav.Link render={<button type="button" onClick={onClick} />}>Learn</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>,
    );
    const button = screen.getByRole("button", { name: "Learn" });
    expect(button).toHaveClass("link");
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toHaveAttribute("href");
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);

    // The line's rules are rooted at the line, not the nav, so a trigger
    // inside a Menu or Popover wrapper (which the nav's donut fences out)
    // is still set as a line; and they shed the elements layer's button box.
    const css = readFileSync(resolve(__dirname, "../components/Nav/Nav.css"), "utf8");
    expect(css).toContain(
      '@scope (.loam-Nav :is(.link, summary.group-title)) to ([class*="loam-"])',
    );
    const line = css.slice(css.indexOf("@scope (.loam-Nav :is("));
    expect(line).toMatch(/:scope\s*{[^}]*background: none/);
    expect(line).toMatch(/:scope\s*{[^}]*border: 0/);
    expect(line).toMatch(/:scope\s*{[^}]*box-shadow: none/);
    expect(line).toMatch(/:scope\s*{[^}]*text-align: start/);
    expect(line).toMatch(/:scope\s*{[^}]*white-space: normal/);
  });

  it("folds a Group natively and reports the change", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<AppNav onOpenChange={onOpenChange} />);
    const group = screen.getByText("Reports").closest("details") as HTMLDetailsElement;
    expect(group.open).toBe(true);

    await user.click(screen.getByText("Reports"));
    expect(group.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    await user.click(screen.getByText("Reports"));
    expect(group.open).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it("holds a controlled Group to its prop until the consumer changes it", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<AppNav open={false} onOpenChange={onOpenChange} />);
    const group = screen.getByText("Reports").closest("details") as HTMLDetailsElement;
    expect(group.open).toBe(false);

    await user.click(screen.getByText("Reports"));
    // The toggle event is queued; let it dispatch, then the revert's own.
    await act(() => new Promise((r) => setTimeout(r, 0)));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(group.open).toBe(false);

    rerender(<AppNav open onOpenChange={onOpenChange} />);
    await act(() => new Promise((r) => setTimeout(r, 0)));
    expect(group.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it("follows a controlled Group driven from onOpenChange", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return <AppNav open={open} onOpenChange={setOpen} />;
    }
    render(<Controlled />);
    const group = screen.getByText("Reports").closest("details") as HTMLDetailsElement;
    await user.click(screen.getByText("Reports"));
    await act(() => new Promise((r) => setTimeout(r, 0)));
    expect(group.open).toBe(true);
    expect(screen.getByRole("link", { name: "Weekly" })).toBeInTheDocument();
  });

  it("throws when a part is rendered outside the Root", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Nav.Title>X</Nav.Title>)).toThrow(/inside <Nav.Root>/);
    expect(() => render(<Nav.Link href="/">X</Nav.Link>)).toThrow(/inside <Nav.Root>/);
    expect(() => render(<Nav.List />)).toThrow(/inside <Nav.Root>/);
    error.mockRestore();
  });

  it("stacks several Roots, each named by its own Title", () => {
    render(
      <>
        <Nav.Root>
          <Nav.Title>Workspace</Nav.Title>
          <Nav.List>
            <Nav.Item>
              <Nav.Link href="/" current>
                Dashboard
              </Nav.Link>
            </Nav.Item>
          </Nav.List>
        </Nav.Root>
        <Nav.Root>
          <Nav.Title>Account</Nav.Title>
          <Nav.List>
            <Nav.Item>
              <Nav.Link href="/profile">Profile</Nav.Link>
            </Nav.Item>
          </Nav.List>
        </Nav.Root>
      </>,
    );
    expect(screen.getByRole("navigation", { name: "Workspace" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Account" })).toBeInTheDocument();
    const css = readFileSync(resolve(__dirname, "../components/Nav/Nav.css"), "utf8");
    expect(css).toMatch(/\.loam-Nav \+ :scope\s*{[^}]*margin-block-start/);
  });

  it("moves the current marker to the block-end edge through --loam-nav-current-edge", () => {
    const css = readFileSync(resolve(__dirname, "../components/Nav/Nav.css"), "utf8");
    expect(css).toMatch(
      /@container not style\(--loam-nav-current-edge: block-end\)\s*{[^}]*border-inline-start: 2px solid transparent/,
    );
    expect(css).toMatch(
      /@container style\(--loam-nav-current-edge: block-end\)\s*{[^}]*border-block-end: 2px solid transparent/,
    );
  });

  it("names the current marker in system colours under forced colours", () => {
    const css = readFileSync(resolve(__dirname, "../components/Nav/Nav.css"), "utf8");
    const forced = css.slice(css.indexOf("@media (forced-colors: active)"));
    expect(forced).toMatch(/&\[aria-current\]\s*{[^}]*border-color: Highlight/);
    expect(forced).toMatch(
      /details\.group:not\(\[open\]\):has\(\.link\[aria-current\]\) > &\s*{[^}]*border-color: Highlight/,
    );
  });
});

function HeaderNav(props: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  currentInside?: boolean;
}) {
  return (
    <>
      <Nav.Root aria-label="Site">
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="/seeds" current={!props.currentInside}>
              Seeds
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Dropdown
              open={props.open}
              defaultOpen={props.defaultOpen}
              onOpenChange={props.onOpenChange}
            >
              <Nav.DropdownTrigger>Plants</Nav.DropdownTrigger>
              <Nav.DropdownPanel>
                <Nav.List>
                  <Nav.Item>
                    <Nav.Link href="/plants/vegetables" current={props.currentInside}>
                      Vegetables
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/plants/herbs">Herbs</Nav.Link>
                  </Nav.Item>
                </Nav.List>
              </Nav.DropdownPanel>
            </Nav.Dropdown>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
      <button type="button">Outside</button>
    </>
  );
}

const navCss = () => readFileSync(resolve(__dirname, "../components/Nav/Nav.css"), "utf8");

describe("Nav.Dropdown", () => {
  it("is a disclosure: a button reporting aria-expanded over a panel of plain links", () => {
    const { container } = render(<HeaderNav />);
    const trigger = screen.getByRole("button", { name: "Plants" });
    const panel = container.querySelector(".loam-Nav-dropdown") as HTMLElement;
    expect(trigger).toHaveAttribute("type", "button");
    expect(trigger).toHaveClass("link", "dropdown-trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    expect(trigger).toHaveAttribute("popovertarget", panel.id);
    expect(trigger).toHaveAttribute("commandfor", panel.id);
    expect(trigger).toHaveAttribute("command", "toggle-popover");
    expect(trigger).not.toHaveAttribute("aria-haspopup");
    expect(container.querySelector("[role='menu'], [role='menuitem']")).toBeNull();
  });

  it("toggles on click, closes on Escape and outside click, and returns focus", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(<HeaderNav onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Plants" });
    const panel = container.querySelector(".loam-Nav-dropdown") as HTMLElement;
    expect(panel).not.toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-popup-open", "true");
    expect(panel).toBeVisible();
    expect(panel).toHaveAttribute("data-open");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    // A disclosure leaves focus on its button; Tab reaches the first link.
    expect(trigger).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Vegetables" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toBeVisible();
    expect(trigger).toHaveFocus();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    await user.click(trigger);
    expect(panel).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(panel).not.toBeVisible();

    await user.click(trigger);
    expect(panel).toBeVisible();
    await user.click(trigger);
    expect(panel).not.toBeVisible();
    expect(onOpenChange).toHaveBeenCalledTimes(6);
  });

  it("holds a controlled open to its prop and follows it when it changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<HeaderNav open={false} onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Plants" });
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    rerender(<HeaderNav open onOpenChange={onOpenChange} />);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Herbs" })).toBeVisible();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it("sets the links inside as lines of the nav, from the panel's own scope", () => {
    const { container } = render(<HeaderNav defaultOpen />);
    const panel = container.querySelector(".loam-Nav-dropdown") as HTMLElement;
    const links = within(panel).getAllByRole("link");
    expect(links).toHaveLength(2);
    // The line scope is rooted at the line, so it reaches a link inside the
    // panel although the nav's own donut stops at the panel (a loam- root).
    for (const link of links) {
      expect(link).toHaveClass("link");
      expect(link.matches(".loam-Nav :is(.link, summary.group-title)")).toBe(true);
      expect(link.matches(".loam-Nav-dropdown .link")).toBe(true);
    }
    const css = navCss();
    const scope = css.slice(css.indexOf('@scope (.loam-Nav-dropdown) to ([class*="loam-"])'));
    expect(scope).toMatch(/ul\s*{[^}]*list-style: none/);
    expect(scope).toMatch(/--_size: var\(--loam-nav-dropdown-size, 16rem\)/);
    expect(scope).toMatch(/inline-size: min\(var\(--_size\), 90vi\)/);
    expect(scope).toMatch(/--loam-nav-current-edge: inline-start/);
    expect(scope).toMatch(/position-area: block-end span-inline-end/);
    expect(scope).toMatch(/position-try-fallbacks: flip-block, flip-inline/);
    expect(scope).toMatch(/@supports not \(anchor-name: --loam-probe\)\s*{[^}]*position: absolute/);
    expect(scope).toMatch(/z-index: var\(--loam-z-popup\)/);
    expect(scope).toMatch(/@media \(forced-colors: active\)\s*{[^}]*border-color: CanvasText/);
  });

  it("gives the trigger the weight and marker when the panel holds the current page", () => {
    const css = navCss();
    expect(css).toMatch(
      /&\.dropdown-trigger:has\(\+ \* \.link\[aria-current\]\)\s*{[^}]*font-weight: 600/,
    );
    expect(css).toMatch(
      /&\.dropdown-trigger\[aria-expanded="false"\]:has\(\+ \* \.link\[aria-current\]\)\s*{[^}]*border-color: var\(--loam-color-primary-strong\)/,
    );
    expect(css).toMatch(
      /&\.dropdown-trigger\[aria-expanded="true"\]::after\s*{[^}]*rotate: -135deg/,
    );
    const forced = css.slice(css.indexOf("@media (forced-colors: active)"));
    expect(forced).toMatch(
      /&\.dropdown-trigger\[aria-expanded="false"\]:has\(\+ \* \.link\[aria-current\]\)\s*{[^}]*border-color: Highlight/,
    );
  });

  it("substitutes the trigger through render and merges the wiring on", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Nav.Root aria-label="Site">
        <Nav.List>
          <Nav.Item>
            <Nav.Dropdown>
              <Nav.DropdownTrigger render={<button data-mine onClick={onClick} />} className="x">
                More
              </Nav.DropdownTrigger>
              <Nav.DropdownPanel>
                <Nav.List>
                  <Nav.Item>
                    <Nav.Link href="/a">A</Nav.Link>
                  </Nav.Item>
                </Nav.List>
              </Nav.DropdownPanel>
            </Nav.Dropdown>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>,
    );
    const trigger = screen.getByRole("button", { name: "More" });
    expect(trigger).toHaveAttribute("data-mine");
    expect(trigger).toHaveClass("link", "dropdown-trigger", "x");
    expect(trigger).toHaveAttribute("commandfor");
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("has no axe violations closed and open, with the current page inside", async () => {
    const closed = render(<HeaderNav />);
    expect(await axe(closed.container, axeOptions)).toHaveNoViolations();
    closed.unmount();
    const open = render(<HeaderNav defaultOpen currentInside />);
    expect(await axe(open.container, axeOptions)).toHaveNoViolations();
  });

  it("throws outside Nav.Item, and its parts outside Nav.Dropdown", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Nav.Root>
          <Nav.Dropdown>
            <Nav.DropdownTrigger>X</Nav.DropdownTrigger>
          </Nav.Dropdown>
        </Nav.Root>,
      ),
    ).toThrow(/inside <Nav.Item>/);
    expect(() =>
      render(
        <Nav.Root>
          <Nav.List>
            <Nav.Item>
              <Nav.DropdownTrigger>X</Nav.DropdownTrigger>
            </Nav.Item>
          </Nav.List>
        </Nav.Root>,
      ),
    ).toThrow(/inside <Nav.Dropdown>/);
    expect(() =>
      render(
        <Nav.Root>
          <Nav.List>
            <Nav.Item>
              <Nav.DropdownPanel />
            </Nav.Item>
          </Nav.List>
        </Nav.Root>,
      ),
    ).toThrow(/inside <Nav.Dropdown>/);
    error.mockRestore();
  });

  describe("with the popover API and anchor positioning", () => {
    // jsdom has neither; shim enough of the popover API for the enhanced
    // path: the open state, `:popover-open`, and the toggle event.
    const OPEN = "data-shim-popover-open";
    let restore: () => void;
    beforeAll(() => {
      const proto = HTMLElement.prototype as HTMLElement & Record<string, unknown>;
      const hadCSS = "CSS" in globalThis;
      const prevCSS = (globalThis as { CSS?: unknown }).CSS;
      (globalThis as { CSS?: unknown }).CSS = { supports: () => true };
      const matches = Element.prototype.matches;
      Element.prototype.matches = function (this: Element, selector: string) {
        if (selector === ":popover-open") return this.hasAttribute(OPEN);
        return matches.call(this, selector);
      };
      const fire = (el: HTMLElement, open: boolean) => {
        const event = new Event("toggle");
        Object.assign(event, {
          oldState: open ? "closed" : "open",
          newState: open ? "open" : "closed",
        });
        el.dispatchEvent(event);
      };
      proto.showPopover = function (this: HTMLElement) {
        if (this.hasAttribute(OPEN)) return;
        this.setAttribute(OPEN, "");
        fire(this, true);
      };
      proto.hidePopover = function (this: HTMLElement) {
        if (!this.hasAttribute(OPEN)) return;
        this.removeAttribute(OPEN);
        fire(this, false);
      };
      restore = () => {
        delete (proto as Record<string, unknown>).showPopover;
        delete (proto as Record<string, unknown>).hidePopover;
        Element.prototype.matches = matches;
        if (hadCSS) (globalThis as { CSS?: unknown }).CSS = prevCSS;
        else delete (globalThis as { CSS?: unknown }).CSS;
      };
    });
    afterAll(() => restore());

    it("is a native popover whose toggle event drives aria-expanded", async () => {
      const onOpenChange = vi.fn();
      const { container } = render(<HeaderNav onOpenChange={onOpenChange} />);
      const trigger = screen.getByRole("button", { name: "Plants" });
      const panel = container.querySelector(".loam-Nav-dropdown") as HTMLElement;
      expect(panel).toHaveAttribute("popover", "auto");
      expect(panel).not.toHaveAttribute("hidden");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      // What the browser does for commandfor / popovertarget.
      await act(async () => panel.showPopover());
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(panel).toHaveAttribute("data-open");
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      await act(async () => panel.hidePopover());
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      // The click handler defers to the browser here: no double toggle.
      await act(async () => trigger.click());
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("reconciles a controlled open into the native state", () => {
      const { container, rerender } = render(<HeaderNav open={false} />);
      const panel = container.querySelector(".loam-Nav-dropdown") as HTMLElement;
      expect(panel.matches(":popover-open")).toBe(false);
      rerender(<HeaderNav open />);
      expect(panel.matches(":popover-open")).toBe(true);
      rerender(<HeaderNav open={false} />);
      expect(panel.matches(":popover-open")).toBe(false);
    });
  });
});
