import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Example from "./Example";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("card-icon-features", () => {
  it("is a Card article with a named features list, a machine-readable price for the set, and a named product link", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("article", { name: "Succulent bowl" })).toHaveClass("loam-Card");
    expect(screen.getByRole("list", { name: "What you get" }).querySelectorAll("li")).toHaveLength(
      4,
    );
    const price = container.querySelector("data.loam-Price");
    expect(price).toHaveAttribute("value", "18.5");
    expect(price).toHaveTextContent("£18.50per bowl");
    expect(screen.getByRole("link", { name: "View succulent bowl" })).toBeInTheDocument();
    expect(screen.getByText("Gift idea").closest(".loam-Badge")).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
