import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/tokens" }));

import { HeaderNav } from "./HeaderNav";

const axeOptions = { rules: { "color-contrast": { enabled: false } } };
afterEach(cleanup);

describe("the header nav", () => {
  it("is a named nav that marks the reader's current section, and only that", async () => {
    const { container } = render(<HeaderNav />);
    expect(screen.getByRole("navigation", { name: "Primitives" })).toBeInTheDocument();
    const current = container.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("Tokens");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
