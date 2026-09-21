import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Rating } from "../components/Rating/index.js";

afterEach(cleanup);

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("Rating", () => {
  it("renders a named group of one radio per star", () => {
    render(<Rating label="Rate this recipe" />);
    const group = screen.getByRole("group", { name: "Rate this recipe" });
    expect(group.tagName).toBe("FIELDSET");
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
    expect(radios.map((radio) => radio.getAttribute("value"))).toEqual(["1", "2", "3", "4", "5"]);
    expect(screen.getByRole("radio", { name: "1 star" })).toBeInTheDocument();
    for (const n of [2, 3, 4, 5]) {
      expect(screen.getByRole("radio", { name: `${n} stars` })).toBeInTheDocument();
    }
  });

  it("checks the clicked star and reports its number", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating label="Rate this recipe" onValueChange={onValueChange} />);
    const third = screen.getByRole("radio", { name: "3 stars" }) as HTMLInputElement;
    await user.click(third);
    expect(third.checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("radio", { name: "4 stars" })).not.toBeChecked();
  });

  it("shares one name across the stars and honours a default", () => {
    render(<Rating label="Rate this recipe" name="stars" defaultValue={4} max={3} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios.every((radio) => radio.getAttribute("name") === "stars")).toBe(true);
    // A default beyond max checks nothing rather than something wrong.
    expect(radios.some((radio) => (radio as HTMLInputElement).checked)).toBe(false);
  });

  it("in display mode renders no radios and one accessible name", () => {
    render(<Rating readOnly label="Average rating" value={3.5} />);
    expect(screen.queryByRole("radio")).toBeNull();
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.getByRole("img", { name: "3.5 out of 5" })).toBeInTheDocument();
    expect(screen.getByText("Average rating")).toBeInTheDocument();
  });

  it("in display mode fills the stars to the nearest half", () => {
    const { container } = render(<Rating readOnly label="Average rating" value={3.7} />);
    const fills = Array.from(container.querySelectorAll(".star")).map((star) =>
      star.getAttribute("data-fill"),
    );
    expect(fills).toEqual(["full", "full", "full", "half", "empty"]);
    expect(screen.getByRole("img")).toHaveAccessibleName("3.7 out of 5");
  });

  it("has no axe violations in either mode", async () => {
    const { container } = render(
      <>
        <Rating label="Rate this recipe" defaultValue={2} />
        <Rating readOnly label="Average rating" value={3.5} />
      </>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});

describe("Rating labels", () => {
  it("takes its words from the consumer", () => {
    render(
      <>
        <Rating label="Note" labels={{ star: (n) => `${n} étoile${n === 1 ? "" : "s"}` }} />
        <Rating label="Note" readOnly value={4} labels={{ value: (v, m) => `${v} sur ${m}` }} />
      </>,
    );
    expect(screen.getByRole("radio", { name: "3 étoiles" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "4 sur 5" })).toBeInTheDocument();
  });
});
