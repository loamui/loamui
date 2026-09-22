import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { components } from "../registry";
import { DocPage } from "./DocPage";

// The page reads a component's stylesheet from disk for the CSS tab; the
// render under test is the page's own structure, not that file.
vi.mock("node:fs", async (importOriginal) => {
  const fs = await importOriginal<typeof import("node:fs")>();
  const readFileSync = () => "";
  return { ...fs, default: { ...fs, readFileSync }, readFileSync };
});

const axeOptions = { rules: { "color-contrast": { enabled: false } } };
afterEach(cleanup);

/**
 * A class string that was once a broken template put `$"…"` into the DOM on
 * every component page and nothing noticed; these pin the structure the CSS
 * selects.
 */
describe("a component page", () => {
  const doc = components.find((c) => c.whenToUse && c.whenNotToUse && c.accessibility)!;

  it("lays out its header, sections and guidance as the stylesheet expects", async () => {
    const { container } = render(<DocPage doc={doc} />);
    const page = container.querySelector(".site-DocPage")!;
    expect(page.querySelector(":scope > header > p:first-child")).toHaveTextContent(doc.category);
    expect(page.querySelector(":scope > header > h1")).toHaveTextContent(doc.name);
    expect(page.querySelectorAll(":scope > section > h2").length).toBeGreaterThanOrEqual(3);
    expect(page.querySelector(".guidanceCard.guidanceYes > h3")).toHaveTextContent(
      "When to use it",
    );
    expect(page.querySelector(".guidanceCard.guidanceNo > h3")).toHaveTextContent("When not to");
    expect(page.querySelector(".guidanceCard.a11y > ul")).not.toBeNull();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("never renders a malformed class name", () => {
    const { container } = render(<DocPage doc={doc} />);
    for (const el of container.querySelectorAll("[class]"))
      expect(el.getAttribute("class"), el.outerHTML.slice(0, 80)).not.toMatch(/[$"]/);
  });
});
