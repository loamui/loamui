import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";

import { Stepper } from "../components/Stepper/index.js";
import type { StepperLabels } from "../components/Stepper/index.js";

afterEach(cleanup);

// Colour contrast is covered live in Storybook; jsdom has no canvas for it.
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

const ORDER = ["Order placed", "Being packed", "Dispatched", "Delivered"];

function Order(props: { current?: number; labels?: StepperLabels }) {
  return (
    <Stepper.Root labels={props.labels}>
      {ORDER.map((title, i) => (
        <Stepper.Step key={title} aria-current={props.current === i ? "step" : undefined}>
          <Stepper.Marker />
          <Stepper.Title>{title}</Stepper.Title>
          <Stepper.Description>What happens at this stage.</Stepper.Description>
        </Stepper.Step>
      ))}
    </Stepper.Root>
  );
}

describe("Stepper", () => {
  it("is a named ordered list of steps with no axe violations", async () => {
    const { container } = render(<Order current={1} />);
    const list = screen.getByRole("list", { name: "Steps" });
    expect(list.tagName).toBe("OL");
    expect(list).toHaveClass("loam-Stepper");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    for (const item of items) expect(item.tagName).toBe("LI");
    expect(container.querySelectorAll("li > span.marker[aria-hidden='true']")).toHaveLength(4);
    expect(container.querySelectorAll("li > span.title")).toHaveLength(4);
    expect(container.querySelectorAll("li > p.description")).toHaveLength(4);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  // The stylesheet is not applied in jsdom, so the contract is checked in
  // two halves: the DOM carries both words in every step, and the
  // selectors that keep the wrong one out of the accessibility tree (and
  // show the right one) match exactly the steps they should.
  it("carries both state words in every step, hidden from sight, from the server render on", () => {
    const html = renderToStaticMarkup(<Order current={2} />);
    expect(html.match(/Completed/g)).toHaveLength(4);
    expect(html.match(/Current step/g)).toHaveLength(4);
    expect(html).toContain('aria-current="step"');

    render(<Order current={2} />);
    for (const item of screen.getAllByRole("listitem")) {
      expect(item.querySelector("span.state.complete > .loam-VisuallyHidden")).toHaveTextContent(
        "Completed",
      );
      expect(item.querySelector("span.state.current > .loam-VisuallyHidden")).toHaveTextContent(
        "Current step",
      );
    }
  });

  const SHOW_COMPLETE = 'li:has(~ li[aria-current="step"]) > span.complete';
  const SHOW_CURRENT = 'li[aria-current="step"] > span.current';
  const HIDE_COMPLETE = 'li:not(:has(~ li[aria-current="step"])) > span.complete';
  const HIDE_CURRENT = 'li:not([aria-current="step"]) > span.current';

  // jsdom's selector engine (nwsapi) matches `:has(~ x)` on the subject
  // itself and cannot parse `:not(:has(~ x))`, so only the current-step
  // pair is exercised against the DOM; the sibling pair is checked in the
  // stylesheet below, like the paint rules that share it.
  it("shows the current word on the current step alone", () => {
    const { container, rerender } = render(<Order current={2} />);
    const shown = (selector: string) =>
      Array.from(container.querySelectorAll(selector)).map((el) =>
        Array.from(el.closest("li")!.parentElement!.children).indexOf(el.closest("li")!),
      );
    expect(shown(SHOW_CURRENT)).toEqual([2]);
    expect(shown(HIDE_CURRENT)).toEqual([0, 1, 3]);

    rerender(<Order current={0} />);
    expect(shown(SHOW_CURRENT)).toEqual([0]);
    expect(shown(HIDE_CURRENT)).toEqual([1, 2, 3]);

    rerender(<Order />);
    expect(shown(SHOW_CURRENT)).toEqual([]);
    expect(shown(HIDE_CURRENT)).toEqual([0, 1, 2, 3]);
  });

  it("decides the words in the stylesheet, under exclusive conditions, and sizes the marker publicly", () => {
    const css = readFileSync(resolve(__dirname, "../components/Stepper/Stepper.css"), "utf8");
    const rule = (selectors: string[], declaration: string) =>
      new RegExp(
        selectors.map((s) => `> ${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).join(",\\s*") +
          `\\s*{[^}]*${declaration}`,
      );
    expect(css).toMatch(rule([SHOW_COMPLETE, SHOW_CURRENT], "display: contents"));
    expect(css).toMatch(rule([HIDE_COMPLETE, HIDE_CURRENT], "display: none"));
    expect(css).toMatch(
      /--_marker-size: var\(--loam-stepper-marker-size, calc\(2 \* var\(--loam-text-md\)\)\)/,
    );
  });

  it("replaces the default strings through labels", () => {
    render(
      <Order
        current={1}
        labels={{ list: "Étapes", complete: "Terminée", current: "Étape en cours" }}
      />,
    );
    expect(screen.getByRole("list", { name: "Étapes" })).toBeInTheDocument();
    const [first] = screen.getAllByRole("listitem");
    expect(first!.querySelector("span.complete")).toHaveTextContent("Terminée");
    expect(first!.querySelector("span.current")).toHaveTextContent("Étape en cours");
  });

  it("lets a name of the consumer's own win over labels.list", () => {
    render(
      <>
        <h2 id="checkout">Checkout</h2>
        <Stepper.Root aria-labelledby="checkout">
          <Stepper.Step>
            <Stepper.Title>Basket</Stepper.Title>
          </Stepper.Step>
        </Stepper.Root>
      </>,
    );
    expect(screen.getByRole("list", { name: "Checkout" })).not.toHaveAttribute("aria-label");
  });

  it("renders the title as a heading or a link through render", () => {
    render(
      <Stepper.Root>
        <Stepper.Step>
          <Stepper.Marker />
          <Stepper.Title render={<a href="#basket" />}>Basket</Stepper.Title>
        </Stepper.Step>
        <Stepper.Step aria-current="step">
          <Stepper.Marker />
          <Stepper.Title render={<h2 />}>Payment</Stepper.Title>
        </Stepper.Step>
      </Stepper.Root>,
    );
    const link = screen.getByRole("link", { name: "Basket" });
    expect(link).toHaveAttribute("href", "#basket");
    expect(link).toHaveClass("title");
    const heading = screen.getByRole("heading", { level: 2, name: "Payment" });
    expect(heading).toHaveClass("title");
    expect(link.closest("li")!.querySelector("span.complete")).toHaveTextContent("Completed");
  });

  it("hosts an icon in the marker in place of the number", () => {
    const { container } = render(
      <Stepper.Root>
        <Stepper.Step>
          <Stepper.Marker>
            <svg viewBox="0 0 16 16" aria-hidden />
          </Stepper.Marker>
          <Stepper.Title>Verified</Stepper.Title>
        </Stepper.Step>
      </Stepper.Root>,
    );
    const marker = container.querySelector("li > span.marker")!;
    expect(marker).toHaveAttribute("aria-hidden", "true");
    expect(marker.querySelector("svg")).not.toBeNull();
  });

  it("refuses a part outside a Root, which is the list it is a step of", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Stepper.Step>
          <Stepper.Title>Orphan</Stepper.Title>
        </Stepper.Step>,
      ),
    ).toThrow("Stepper.Step must be rendered inside <Stepper.Root>.");
    expect(() => render(<Stepper.Title>Orphan</Stepper.Title>)).toThrow(
      "Stepper.Title must be rendered inside <Stepper.Root>.",
    );
    error.mockRestore();
  });
});
