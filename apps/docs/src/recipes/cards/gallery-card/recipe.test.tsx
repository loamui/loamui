import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("gallery-card", () => {
  it("is a Card article holding a named photo carousel with named controls, a named rating and a price", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("article", { name: "The Orchard Cabin" })).toHaveClass("loam-Card");
    const photos = screen.getByRole("region", { name: "Photos of the Orchard Cabin" });
    expect(photos).toHaveAttribute("aria-roledescription", "carousel");
    expect(photos.querySelectorAll("ul.track > li img")).toHaveLength(3);
    expect(
      screen.getByAltText("A timber building among orchard trees in low sunlight"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to photo 2 of 3" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "4.8 out of 5" })).toBeInTheDocument();
    expect(container.querySelector("data.loam-Price")).toHaveTextContent("£145per night");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
