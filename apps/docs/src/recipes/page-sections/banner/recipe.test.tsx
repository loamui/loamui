import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("banner", () => {
  it("is plain content with no role, a message and a link that goes somewhere", async () => {
    const { container } = render(<Recipe />);
    const bar = container.querySelector(".banner");
    expect(bar).not.toHaveAttribute("role");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText(/spring catalogue is out/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read the catalogue" })).toHaveAttribute(
      "href",
      "/catalogue",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
