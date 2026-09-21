import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/tokens" }));

import { Sidebar } from "./Sidebar";

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

afterEach(cleanup);

/**
 * The sidebar is a landmark with one current page. Every visitor to the docs
 * uses it, so it gets the same axe pass the recipes get.
 */
describe("the documentation sidebar", () => {
  it("is a named navigation landmark marking exactly one current page", async () => {
    const { container } = render(<Sidebar />);
    expect(screen.getByRole("navigation", { name: "Documentation" })).toBeInTheDocument();
    const current = container.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("Tokens");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
