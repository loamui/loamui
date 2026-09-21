import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("comment-thread", () => {
  it("nests two reply articles in a named list inside the parent comment", async () => {
    const { container } = render(<Recipe />);
    const parent = screen.getByRole("article", { name: "Dafydd Rees" });
    expect(parent).toHaveClass("comment-thread");
    const replies = screen.getByRole("list", { name: "Replies to Dafydd Rees" });
    expect(parent).toContainElement(replies);
    expect(within(replies).getAllByRole("listitem")).toHaveLength(2);
    expect(within(replies).getByRole("article", { name: "Nia Prosser" })).toBeInTheDocument();
    expect(within(replies).getByRole("article", { name: "Priya Natarajan" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reply to Priya Natarajan" })).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
