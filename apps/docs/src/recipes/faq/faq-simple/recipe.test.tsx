import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("faq-simple", () => {
  it("is a region named by its h2 holding four closed disclosures that share one name", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Frequently asked questions" })).toHaveClass(
      "faq-simple",
    );
    const details = Array.from(container.querySelectorAll("details"));
    expect(details).toHaveLength(4);
    for (const item of details) {
      expect(item.open).toBe(false);
      expect(item).toHaveAttribute("name", "faq-simple");
    }
    // jsdom does not model exclusive <details name>; the browser does. The
    // testable part is that a summary opens its own answer.
    fireEvent.click(screen.getByText("How long does seed keep?"));
    expect(details.filter((item) => item.open)).toEqual([details[0]]);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
