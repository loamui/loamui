import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("comment", () => {
  it("is an article named by its author, with a relative time and actions that name the comment", async () => {
    const { container } = render(<Recipe />);
    const article = screen.getByRole("article", { name: "Priya Natarajan" });
    expect(article).toHaveClass("comment");
    const time = container.querySelector("time")!;
    expect(time).toHaveAttribute("dateTime", "2026-09-05T14:30:00Z");
    expect(time).toHaveTextContent("3 days ago");
    expect(screen.getByRole("button", { name: "Reply to Priya Natarajan" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Report Priya Natarajan’s comment" }),
    ).toHaveTextContent(/^Report/);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
