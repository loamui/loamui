import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("profile-card", () => {
  it("is a Card rendered as an article named by the person, with three labelled figures and a profile link", async () => {
    const { container } = render(<Recipe />);
    const card = screen.getByRole("article", { name: "Imogen Hartley" });
    expect(card).toHaveClass("loam-Card", "profile-card");
    expect(card.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("heading", { level: 2, name: "Imogen Hartley" })).toBeInTheDocument();
    expect(screen.getByText("Varieties saved").tagName).toBe("DT");
    expect(screen.getByText("38").tagName).toBe("DD");
    expect(card.querySelectorAll("dl.stats dd")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Meet Imogen" })).toHaveAttribute(
      "href",
      "/growers/imogen-hartley",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
