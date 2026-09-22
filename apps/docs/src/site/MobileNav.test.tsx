import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/tokens" }));

import { MobileNav } from "./MobileNav";

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

afterEach(cleanup);

describe("the mobile navigation", () => {
  it("has a named trigger and opens a named panel holding the nav", async () => {
    const { container } = render(<MobileNav />);
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(trigger);
    const panel = screen.getByRole("dialog", { name: "Navigation" });
    expect(panel).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tokens" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Recipes" })).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
