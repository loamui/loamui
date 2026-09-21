import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("users-table-with-roles", () => {
  it("is a form around a table whose selects are named for each person, with times and statuses in words", async () => {
    const { container } = render(<Recipe />);
    const form = container.querySelector("form.users-table-with-roles")!;
    expect(form).toHaveAttribute("method", "post");
    expect(form).toHaveAttribute("action", "/team/roles");
    expect(container.querySelector("caption")).toHaveTextContent(/Team members/);
    expect(screen.getAllByRole("rowheader")).toHaveLength(5);

    const selects = screen.getAllByRole("combobox");
    expect(selects).toHaveLength(5);
    const imogen = screen.getByRole("combobox", { name: "Role for Imogen Hartley" });
    expect(imogen).toHaveValue("admin");
    expect(imogen).toHaveAttribute("name", "role[imogen]");
    expect(screen.getByRole("combobox", { name: "Role for Tomos Ellis" })).toHaveValue("viewer");

    const times = container.querySelectorAll("time");
    expect(times).toHaveLength(4);
    expect(times[0]).toHaveAttribute("datetime", "2026-09-08T07:42:00Z");
    expect(times[0]).toHaveTextContent("1 hour ago");
    expect(times[1]).toHaveTextContent("yesterday");
    expect(times[3]).toHaveTextContent("2 weeks ago");
    expect(screen.getByText("Not yet")).toBeInTheDocument();

    expect(screen.getAllByText("Active")).toHaveLength(3);
    expect(screen.getByText("Invited").closest("span.invited")).not.toBeNull();
    expect(screen.getByText("Suspended").closest("span.suspended")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Save roles" })).toHaveAttribute("type", "submit");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
