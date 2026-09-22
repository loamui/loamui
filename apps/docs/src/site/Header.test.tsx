import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

vi.mock("next/navigation", () => ({
  usePathname: () => "/docs/tokens",
  useRouter: () => ({ push() {} }),
}));

import { Header } from "./Header";

const axeOptions = { rules: { "color-contrast": { enabled: false } } };
beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("the site header", () => {
  it("is the banner landmark, holding the home link, the navs, search and the repository", async () => {
    const { container } = render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LoamUI home" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primitives" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Resources" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search documentation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LoamUI on GitHub" })).toHaveAttribute(
      "rel",
      "noreferrer",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
