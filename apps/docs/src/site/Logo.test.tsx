import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Logo } from "./Logo";

const axeOptions = { rules: { "color-contrast": { enabled: false } } };
afterEach(cleanup);

describe("the logo", () => {
  it("is a named home link whose mark is decorative", async () => {
    const { container } = render(<Logo />);
    expect(screen.getByRole("link", { name: "LoamUI home" })).toHaveAttribute("href", "/");
    expect(container.querySelector("svg")?.closest("[aria-hidden]")).not.toBeNull();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
