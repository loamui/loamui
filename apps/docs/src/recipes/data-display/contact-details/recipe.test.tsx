import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("contact-details", () => {
  it("is an address element holding a dl whose phone and email are links that act", async () => {
    const { container } = render(<Recipe />);
    const address = container.querySelector("address.contact-details");
    expect(address).not.toBeNull();
    expect(address?.querySelector(":scope > dl")).not.toBeNull();
    expect(screen.getByText("Phone").tagName).toBe("DT");
    expect(screen.getByRole("link", { name: "01588 640210" })).toHaveAttribute(
      "href",
      "tel:+441588640210",
    );
    expect(screen.getByRole("link", { name: "hello@hedgerow.coop" })).toHaveAttribute(
      "href",
      "mailto:hello@hedgerow.coop",
    );
    const open = screen.getByText("Open");
    expect(open.parentElement?.querySelectorAll("dd")).toHaveLength(2);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
