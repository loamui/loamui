import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("error-503", () => {
  it("is a region named by its h1 with a refresh button named in full", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "All our servers are busy" })).toHaveClass(
      "error-503",
    );
    expect(screen.getByText("503").tagName).toBe("P");
    const refresh = screen.getByRole("button", { name: "Refresh the page" });
    expect(refresh).toHaveClass("loam-Button");
    expect(refresh).toHaveAttribute("type", "button");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
