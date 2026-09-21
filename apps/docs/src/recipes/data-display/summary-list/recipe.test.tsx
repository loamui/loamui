import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("summary-list", () => {
  it("is a region named by its heading, a dl of rows whose links say what they change", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Your membership" });
    expect(region).toHaveClass("summary-list");
    const rows = region.querySelectorAll("dl > div.row");
    expect(rows).toHaveLength(6);
    for (const row of rows) {
      expect(row.querySelector("dt")).not.toBeNull();
      expect(row.querySelector("dd.value")).not.toBeNull();
    }
    expect(screen.getByRole("link", { name: "Change name" })).toHaveAttribute(
      "href",
      "/account/name",
    );
    expect(screen.getByRole("link", { name: "Add phone number" })).toBeInTheDocument();
    expect(screen.getByText("Not provided").tagName).toBe("DD");
    expect(container.querySelector("time")).toHaveAttribute("datetime", "2027-03-01");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
