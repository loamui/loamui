import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const pathname = vi.hoisted(() => ({ value: "/docs/tokens/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

import { MarkdownLink } from "./MarkdownLink";

afterEach(cleanup);

describe("the markdown link", () => {
  it("points at the page's twin, without a trailing slash", () => {
    render(<MarkdownLink />);
    expect(screen.getByRole("link", { name: "View as Markdown" })).toHaveAttribute(
      "href",
      "/docs/tokens.md",
    );
  });

  it("is absent outside the docs, where there is no twin", () => {
    pathname.value = "/recipes";
    const { container } = render(<MarkdownLink />);
    expect(container).toBeEmptyDOMElement();
  });
});
