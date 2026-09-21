import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("faq-with-image", () => {
  it("is a region named by its h2 with a hidden illustration and four disclosures sharing one name", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Sowing questions" })).toHaveClass("faq-with-image");
    expect(container.querySelector("svg.illustration")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const details = Array.from(container.querySelectorAll("details"));
    expect(details).toHaveLength(4);
    for (const item of details) {
      expect(item).toHaveAttribute("name", "faq-with-image");
      expect(item.open).toBe(false);
    }
    fireEvent.click(screen.getByText("How deep do I sow?"));
    expect(details.filter((item) => item.open)).toEqual([details[0]]);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
