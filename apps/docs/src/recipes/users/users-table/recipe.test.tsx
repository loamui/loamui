import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("users-table", () => {
  it("is a captioned table with a row header per person and a menu of actions named for each", async () => {
    const { container } = render(<Recipe />);
    expect(container.querySelector("caption")).toHaveTextContent(/stewards and staff/);
    expect(screen.getAllByRole("columnheader").map((th) => th.textContent)).toEqual([
      "Member",
      "Role",
      "Email",
      "Phone",
      "Actions",
    ]);
    const rows = screen.getAllByRole("rowheader");
    expect(rows).toHaveLength(5);
    expect(rows[0]).toHaveTextContent("Imogen Hartley");
    expect(rows[0]!.querySelector(".loam-Avatar")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "bryn@hedgerow.example" })).toHaveAttribute(
      "href",
      "mailto:bryn@hedgerow.example",
    );
    expect(screen.getByRole("link", { name: "01584 870123" })).toHaveAttribute(
      "href",
      "tel:+441584870123",
    );

    const triggers = screen.getAllByRole("button", { name: /^Actions for / });
    expect(triggers).toHaveLength(5);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    fireEvent.click(screen.getByRole("button", { name: "Actions for Sadia Rahman" }));
    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Edit details",
      "Change role",
      "Remove from team",
    ]);
    expect(items[0]).toHaveAttribute("href", "/team/sadia/edit");
    await waitFor(() => expect(items[0]).toHaveFocus());
    const remove = screen.getByRole("menuitem", { name: "Remove from team" });
    expect(remove).toHaveAttribute("type", "submit");
    expect(remove.closest("form")).toHaveAttribute("action", "/team/sadia/remove");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
