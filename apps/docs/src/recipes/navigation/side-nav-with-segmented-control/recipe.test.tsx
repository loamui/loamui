import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("side-nav-with-segmented-control", () => {
  it("is a named radio group that swaps which named nav is shown", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("radiogroup", { name: "Section" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Account" })).toBeChecked();
    expect(screen.getByRole("navigation", { name: "Account" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Shop" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(screen.getByRole("radio", { name: "Shop" }));
    expect(screen.getByRole("radio", { name: "Shop" })).toBeChecked();
    expect(screen.getByRole("navigation", { name: "Shop" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Account" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Listings" })).toHaveAttribute(
      "href",
      "/shop/listings",
    );
    expect(container.querySelector("[aria-current]")!.closest("[hidden]")).not.toBeNull();
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
