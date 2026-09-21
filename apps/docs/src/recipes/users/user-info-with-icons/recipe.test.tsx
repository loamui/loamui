import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("user-info-with-icons", () => {
  it("names the person in a heading and lists an email and a phone as real links under hidden terms", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("heading", { level: 2, name: "Bryn Powell" })).toBeInTheDocument();
    expect(container.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Head grower")).toBeInTheDocument();

    const terms = screen.getAllByRole("term");
    expect(terms.map((term) => term.textContent)).toEqual(["Email", "Phone"]);
    for (const term of terms) expect(term).toHaveClass("loam-VisuallyHidden");
    expect(screen.getByRole("link", { name: "bryn@hedgerow.example" })).toHaveAttribute(
      "href",
      "mailto:bryn@hedgerow.example",
    );
    expect(screen.getByRole("link", { name: "01584 870123" })).toHaveAttribute(
      "href",
      "tel:+441584870123",
    );
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
