import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("address-fields", () => {
  it("is a group named by its legend, one labelled line per part with a sectioned autofill purpose", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("group", { name: "Delivery address" })).toHaveClass("address-fields");
    const line1 = screen.getByLabelText("Address line 1");
    expect(line1).toHaveAttribute("autocomplete", "section-delivery shipping address-line1");
    expect(line1).toHaveAccessibleDescription("Include your flat number if you have one.");
    expect(screen.getByLabelText("Address line 2 (optional)")).not.toBeRequired();
    const postcode = screen.getByLabelText("Postcode");
    expect((postcode as HTMLInputElement).type).toBe("text");
    expect(postcode).toHaveAttribute("autocomplete", "section-delivery shipping postal-code");
    const country = screen.getByLabelText("Country");
    expect(country.tagName).toBe("SELECT");
    expect(country).toHaveValue("");
    expect(country).toHaveAttribute("autocomplete", "section-delivery shipping country-name");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
