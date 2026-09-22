import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Loader } from "../components/Loader/index.js";

afterEach(cleanup);

describe("Loader", () => {
  it("emits data-size only when a size is asked for", () => {
    const { rerender } = render(<Loader />);
    const loader = screen.getByRole("status", { name: "Loading" });
    expect(loader).not.toHaveAttribute("data-size");
    expect(loader).not.toHaveAttribute("style");

    rerender(<Loader size="lg" label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toHaveAttribute("data-size", "lg");
  });
});
