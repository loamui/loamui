import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("hero-centered", () => {
  it("is a region named by its h1, with a signpost and a plain link to go", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Join the co-op that grows its own seed." });
    expect(region).toHaveClass("hero-centered");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("grows its own seed");
    expect(screen.getByRole("link", { name: "Become a member" })).toHaveAttribute(
      "href",
      "/membership/join",
    );
    expect(screen.getByRole("link", { name: "Compare the tiers" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
