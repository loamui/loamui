import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { HeroShowcase } from "@/home/showcases";
import { RestaurantMenu } from "@/home/agent-demo/menu";
import { RecipeStage } from "../recipes/recipe-stage";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe("interactive site demos", () => {
  it("saves demo settings and restores the saved values when edits are cancelled", () => {
    render(<HeroShowcase />);
    const email = screen.getByLabelText("Work email");
    const notifications = screen.getByRole("checkbox", { name: "Email notifications" });
    fireEvent.change(email, { target: { value: "saved@example.com" } });
    fireEvent.click(notifications);
    expect(screen.getByText("Notifications on")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByText("Muted")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Changes saved for this demo.");
    fireEvent.change(email, { target: { value: "draft@example.com" } });
    fireEvent.click(notifications);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(email).toHaveValue("saved@example.com");
    expect(notifications).not.toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent("Unsaved changes discarded.");
  });

  it("does not save a malformed email", () => {
    render(<HeroShowcase />);
    fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "unfinished@" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("adds and removes a demo selection without offering sold-out courses", () => {
    render(<RestaurantMenu />);
    expect(screen.getByRole("button", { name: "Dessert unavailable" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Add starter" }));
    expect(screen.getByRole("status")).toHaveTextContent("Starter added");
    fireEvent.click(screen.getByRole("button", { name: "Remove starter" }));
    expect(screen.getByRole("status")).toHaveTextContent("No courses selected.");
  });

  it("composes native width selection and direction controls around an independent preview", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { container } = render(
      <RecipeStage title="Test recipe">
        <p>Preview content</p>
      </RecipeStage>,
    );
    const widths = screen.getByRole("group", { name: "Preview width" });
    expect(within(widths).getByRole("radio", { name: "Full width" })).toBeChecked();
    fireEvent.click(within(widths).getByRole("radio", { name: "Phone width" }));
    expect(container.querySelector(".stage")).toHaveAttribute("data-width", "narrow");
    fireEvent.click(screen.getByRole("button", { name: "Right-to-left layout" }));
    expect(container.querySelector(".frame")).toHaveAttribute("dir", "rtl");
    fireEvent.click(screen.getByRole("button", { name: "Show the frame in dark" }));
    expect(container.querySelector(".frame")).toHaveAttribute("data-theme", "dark");
    expect(JSON.parse(sessionStorage.getItem("loamui-examples-stage")!)).toEqual({
      width: "narrow",
      rtl: true,
      scheme: "dark",
    });
  });
});
