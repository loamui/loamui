import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { useState } from "react";
import type { CSSProperties } from "react";

import { Table } from "../components/Table/index.js";
import type { TableProps, TableSortDirection } from "../components/Table/index.js";

afterEach(cleanup);

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

function SortableDemo({ onSortChange }: { onSortChange?: (next: TableSortDirection) => void }) {
  const [sort, setSort] = useState<TableSortDirection>("none");
  return (
    <Table.Root>
      <Table.Caption>People</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th sort={sort}>
            <Table.SortButton
              onSortChange={(next) => {
                onSortChange?.(next);
                setSort(next);
              }}
            >
              Name
            </Table.SortButton>
          </Table.Th>
          <Table.Th>Role</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Ada</Table.Td>
          <Table.Td>Engineer</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table.Root>
  );
}

// jsdom lays nothing out and has no ResizeObserver. This double records
// what the wrapper observes and lets a test hand it the overflow a browser
// would measure, on either axis.
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  constructor(readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function overflow(el: Element, sizes: Partial<Record<"inline" | "block", [number, number]>>) {
  const [scrollWidth, clientWidth] = sizes.inline ?? [0, 0];
  const [scrollHeight, clientHeight] = sizes.block ?? [0, 0];
  Object.defineProperty(el, "scrollWidth", { value: scrollWidth, configurable: true });
  Object.defineProperty(el, "clientWidth", { value: clientWidth, configurable: true });
  Object.defineProperty(el, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: clientHeight, configurable: true });
  const observer = FakeResizeObserver.instances.at(-1)!;
  act(() => {
    observer.callback([], observer as unknown as ResizeObserver);
  });
}

function People(props: TableProps) {
  return (
    <Table.Root {...props}>
      <Table.Caption>People</Table.Caption>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Ada</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table.Root>
  );
}

describe("Table scroll region", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    FakeResizeObserver.instances = [];
  });

  it("adds no region, name or tab stop while the table fits", () => {
    const { container } = render(<People />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).not.toHaveAttribute("role");
    expect(wrapper).not.toHaveAttribute("aria-label");
    expect(wrapper).not.toHaveAttribute("aria-labelledby");
    expect(wrapper).not.toHaveAttribute("tabindex");
  });

  it("becomes a region named by its caption when it overflows inline", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const { container } = render(<People />);
    overflow(container.firstElementChild!, { inline: [800, 400] });
    const region = screen.getByRole("region", { name: "People" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).not.toHaveAttribute("aria-label");
  });

  it("is a region too when a fixed block size makes it scroll", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const { container } = render(
      <Table.Root style={{ blockSize: "12rem" }}>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Ada</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table.Root>,
    );
    overflow(container.firstElementChild!, { block: [900, 192] });
    const region = screen.getByRole("region", { name: "Scrollable table" });
    expect(region).toHaveAttribute("tabindex", "0");

    overflow(container.firstElementChild!, { block: [192, 192] });
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("is a region when --loam-table-block-size caps it and the rows overflow", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const { container } = render(
      <Table.Root stickyHeader style={{ "--loam-table-block-size": "12rem" } as CSSProperties}>
        <Table.Caption>People</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">Name</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Ada</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table.Root>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue("--loam-table-block-size")).toBe("12rem");
    expect(wrapper).not.toHaveAttribute("role");

    overflow(wrapper, { block: [900, 192] });
    const region = screen.getByRole("region", { name: "People" });
    expect(region).toBe(wrapper);
    expect(region).toHaveAttribute("tabindex", "0");

    const css = readFileSync(resolve(__dirname, "../components/Table/Table.css"), "utf8");
    expect(css).toMatch(/:scope\s*{[^}]*max-block-size: var\(--loam-table-block-size, none\)/);
  });

  it("keeps the consumer's name, role and tab stop, overflowing or not", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const { container } = render(<People aria-label="Team" role="group" tabIndex={-1} />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveAttribute("aria-label", "Team");
    expect(wrapper).toHaveAttribute("role", "group");
    expect(wrapper).toHaveAttribute("tabindex", "-1");

    overflow(wrapper, { inline: [800, 400] });
    expect(wrapper).toHaveAttribute("aria-label", "Team");
    expect(wrapper).not.toHaveAttribute("aria-labelledby");
    expect(wrapper).toHaveAttribute("role", "group");
    expect(wrapper).toHaveAttribute("tabindex", "-1");
  });

  it("lets a consumer aria-labelledby stand in for the caption", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const { container } = render(
      <>
        <h2 id="team-heading">Team</h2>
        <People aria-labelledby="team-heading" />
      </>,
    );
    const wrapper = container.querySelector(".loam-Table")!;
    overflow(wrapper, { inline: [800, 400] });
    expect(screen.getByRole("region", { name: "Team" })).toBe(wrapper);
    expect(wrapper).not.toHaveAttribute("aria-label");
  });
});

describe("Table display hooks", () => {
  it("emits each display prop as its data attribute, and nothing when unset", () => {
    const { container, rerender } = render(<People />);
    const wrapper = container.firstElementChild!;
    for (const attribute of [
      "data-striped",
      "data-hover",
      "data-col-borders",
      "data-sticky-header",
    ]) {
      expect(wrapper).not.toHaveAttribute(attribute);
    }

    rerender(<People striped highlightOnHover withColumnBorders stickyHeader />);
    expect(wrapper).toHaveAttribute("data-striped", "true");
    expect(wrapper).toHaveAttribute("data-hover", "true");
    expect(wrapper).toHaveAttribute("data-col-borders", "true");
    expect(wrapper).toHaveAttribute("data-sticky-header", "true");

    rerender(<People stickyHeader={false} />);
    expect(wrapper).not.toHaveAttribute("data-sticky-header");
  });

  it("sticks the header row under data-sticky-header, with its own edge and an opaque surface", () => {
    const css = readFileSync(resolve(__dirname, "../components/Table/Table.css"), "utf8");
    const sticky = css.slice(css.indexOf(":scope[data-sticky-header]"));
    expect(sticky).toMatch(/table\s*{[^}]*border-collapse: separate/);
    expect(sticky).toMatch(/table\s*{[^}]*border-spacing: 0/);
    expect(sticky).toMatch(
      /thead th\s*{[^}]*background: var\(--loam-color-surface\)[^}]*inset-block-start: 0[^}]*position: sticky[^}]*z-index: 1/,
    );
  });
});

describe("Table sort header", () => {
  it("carries aria-sort on the header cell and a column scope by default", () => {
    render(<SortableDemo />);
    const header = screen.getByRole("columnheader", { name: /Name/ });
    expect(header).toHaveAttribute("aria-sort", "none");
    expect(header).toHaveAttribute("scope", "col");
    expect(screen.getByRole("columnheader", { name: "Role" })).not.toHaveAttribute("aria-sort");
  });

  it("names the button by the column and says what a press will do", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<SortableDemo onSortChange={onSortChange} />);
    const header = screen.getByRole("columnheader", { name: /Name/ });
    const button = screen.getByRole("button", { name: "Name sort ascending" });

    await user.click(button);
    expect(onSortChange).toHaveBeenLastCalledWith("ascending");
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(button).toHaveAccessibleName("Name sort descending");

    await user.click(button);
    expect(onSortChange).toHaveBeenLastCalledWith("descending");
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(button).toHaveAccessibleName("Name sort ascending");
  });

  it("toggles from the keyboard as a native button", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<SortableDemo onSortChange={onSortChange} />);
    await user.tab();
    expect(screen.getByRole("button", { name: /Name/ })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSortChange).toHaveBeenLastCalledWith("ascending");
    await user.keyboard(" ");
    expect(onSortChange).toHaveBeenLastCalledWith("descending");
  });

  it("takes its words from the consumer", () => {
    render(
      <Table.Root>
        <Table.Thead>
          <Table.Tr>
            <Table.Th sort="descending">
              <Table.SortButton labels={{ sort: (column, next) => ` nach ${column} ${next}` }}>
                Name
              </Table.SortButton>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
      </Table.Root>,
    );
    expect(screen.getByRole("button", { name: "Name nach Name ascending" })).toBeInTheDocument();
  });

  it("refuses a sort button outside a sortable header, and a Th outside a Table", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <table>
          <thead>
            <tr>
              <Table.Th>Name</Table.Th>
            </tr>
          </thead>
        </table>,
      ),
    ).toThrow("Table.Th must be rendered inside <Table.Root>.");
    expect(() =>
      render(
        <Table.Root>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Table.SortButton>Name</Table.SortButton>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
        </Table.Root>,
      ),
    ).toThrow(/inside a <Table.Th sort>/);
    error.mockRestore();
  });

  it("has no axe violations", async () => {
    const { container } = render(<SortableDemo />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
