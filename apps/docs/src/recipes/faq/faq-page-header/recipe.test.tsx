import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("faq-page-header", () => {
  it("is a region named by its h1 with contact links before five disclosures sharing one name", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("region", { name: "Help and support" })).toHaveClass("faq-page-header");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Help and support");
    const email = screen.getByRole("link", { name: "hello@hedgerow.coop" });
    expect(email).toHaveAttribute("href", "mailto:hello@hedgerow.coop");
    expect(screen.getByRole("link", { name: "01588 640210" })).toHaveAttribute(
      "href",
      "tel:+441588640210",
    );
    const details = Array.from(container.querySelectorAll("details"));
    expect(details).toHaveLength(5);
    for (const item of details) {
      expect(item).toHaveAttribute("name", "faq-page-header");
      expect(email.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
