import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("tasks-card", () => {
  it("is a Card article with a due date, a named progress bar and a named group of the team", async () => {
    const { container } = render(<Recipe />);
    expect(screen.getByRole("article", { name: "Spring catalogue 2027" })).toHaveClass("loam-Card");
    expect(container.querySelector("time")).toHaveAttribute("datetime", "2026-11-30");
    const bar = screen.getByRole("progressbar", { name: "Tasks done" });
    expect(bar).toHaveAttribute("aria-valuetext", "60% of tasks done");
    expect(container.querySelector("p.count")).toHaveTextContent("12 of 20");
    const team = screen.getByRole("list", { name: "Working on this" });
    expect(team.querySelectorAll("li")).toHaveLength(5);
    expect(screen.getByRole("img", { name: "3 more people" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Nia Prosser" })).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
