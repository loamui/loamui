import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import type { FormEvent } from "react";

import { Search } from "../components/Search/index.js";
import { Field } from "../index.js";

afterEach(cleanup);

// jsdom's role map (aria-query 5.3) predates the <search> element, so the
// landmark is found by its aria-label on the element itself, not by role.
const landmark = (name: string) => screen.getByLabelText(name, { selector: "search" });

describe("Search", () => {
  it("renders a search landmark around a form, with a searchbox named by Search.Label", () => {
    render(
      <Search.Root action="/search">
        <Search.Label>Search this site</Search.Label>
        <Search.Input />
        <Search.Button />
      </Search.Root>,
    );
    const root = landmark("Search");
    expect(root.tagName).toBe("SEARCH");
    const form = root.querySelector("form")!;
    expect(form).toHaveAttribute("action", "/search");
    expect(form).toHaveAttribute("method", "get");

    const box = screen.getByRole("searchbox", { name: "Search this site" });
    expect(root).toContainElement(box);
    expect(box).toHaveAttribute("type", "search");
    expect(box).toHaveAttribute("name", "q");
    expect(box).toHaveAttribute("enterkeyhint", "search");
    expect(box).toHaveAttribute("inputmode", "search");
    // The browser's own autofill help stays available.
    expect(box).not.toHaveAttribute("autocomplete");

    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute("type", "submit");
  });

  it("submits on Enter in the box and on the button", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <Search.Root onSubmit={onSubmit}>
        <Search.Label>Search this site</Search.Label>
        <Search.Input />
        <Search.Button />
      </Search.Root>,
    );
    await user.type(screen.getByRole("searchbox"), "tokens{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("tells two searches apart by aria-label", () => {
    render(
      <>
        <Search.Root>
          <Search.Label>Search this site</Search.Label>
          <Search.Input />
          <Search.Button />
        </Search.Root>
        <Search.Root aria-label="Site search">
          <Search.Label>Search all of Loam</Search.Label>
          <Search.Input />
          <Search.Button />
        </Search.Root>
      </>,
    );
    expect(landmark("Search")).toBeInTheDocument();
    expect(landmark("Site search")).toBeInTheDocument();
  });

  it("takes the Field's label and description when composed inside a Field", () => {
    render(
      <Search.Root aria-label="Search orders">
        <Field.Root>
          <Field.Label>Order number</Field.Label>
          <Field.Description>The reference on your confirmation email.</Field.Description>
          <Search.Input name="order" />
        </Field.Root>
        <Search.Button>Find order</Search.Button>
      </Search.Root>,
    );
    const box = screen.getByRole("searchbox", { name: "Order number" });
    expect(box).toHaveAccessibleDescription("The reference on your confirmation email.");
    expect(box).toHaveAttribute("name", "order");
    expect(landmark("Search orders")).toContainElement(box);
  });

  it("renders an icon-only button that keeps its name", () => {
    render(
      <Search.Root>
        <Search.Label>Search this site</Search.Label>
        <Search.Input />
        <Search.Button aria-label="Search">
          <svg aria-hidden viewBox="0 0 24 24" />
        </Search.Button>
      </Search.Root>,
    );
    const button = screen.getByRole("button", { name: "Search" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button.querySelector("svg")).not.toBeNull();
  });

  it("has no axe violations, standalone and in a Field", async () => {
    const { container } = render(
      <>
        <Search.Root>
          <Search.Label>Search this site</Search.Label>
          <Search.Input />
          <Search.Button />
        </Search.Root>
        <Search.Root aria-label="Search orders">
          <Field.Root>
            <Field.Label>Order number</Field.Label>
            <Search.Input name="order" />
          </Field.Root>
          <Search.Button>Find order</Search.Button>
        </Search.Root>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
