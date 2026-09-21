import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("call-to-action-with-media", () => {
  it("is a region named by its heading, with the words before the picture in source order", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Sow along with us this spring" });
    expect(region).toHaveClass("call-to-action-with-media");
    const link = screen.getByRole("link", { name: "Open the sowing calendar" });
    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).toMatch(/polytunnel/);
    expect(link.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
