import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/tokens" }));

import { Sidebar } from "./Sidebar";

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

afterEach(cleanup);

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
