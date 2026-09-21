import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("language-picker", () => {
  it("is a button named for its purpose and value that opens a radio group of languages, each in its own lang", async () => {
    const { container } = render(<Recipe />);
    const trigger = screen.getByRole("button", { name: "Language: English" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
    const items = screen.getAllByRole("menuitemradio");
    expect(items.map((item) => item.textContent)).toEqual([
      "ENEnglish",
      "CYCymraeg",
      "FRFrançais",
      "DEDeutsch",
      "NLNederlands",
    ]);
    expect(screen.getByRole("menuitemradio", { name: "English" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    const welsh = screen.getByRole("menuitemradio", { name: "Cymraeg" });
    expect(welsh.querySelector("[lang]")).toHaveAttribute("lang", "cy");
    await waitFor(() => expect(items[0]).toHaveFocus());
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(welsh);
    expect(screen.getByRole("button", { name: "Language: Cymraeg" })).toBe(trigger);
    expect(menu).not.toBeVisible();
  });
});
