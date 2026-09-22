import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { RecipeCodePanel } from "./RecipeCodePanel";

const { loadCode } = vi.hoisted(() => ({ loadCode: vi.fn() }));
vi.mock("./RecipeCode", () => {
  loadCode();
  return { RecipeCode: () => <input aria-label="Code state" defaultValue="initial" /> };
});

afterEach(cleanup);

const props = {
  source: { tsx: "export default function Recipe() {}", css: "" },
  href: "/recipes/forms/sign-in",
};

describe("RecipeCodePanel", () => {
  it("serves a source link without JavaScript or highlighted code", () => {
    const html = renderToString(<RecipeCodePanel {...props} />);
    expect(html).toContain("/recipes/forms/sign-in#code");
    expect(html).not.toContain("<pre");
    expect(loadCode).not.toHaveBeenCalled();
  });

  it("loads code only on opening and retains its state across close and reopen", async () => {
    const { container } = render(<RecipeCodePanel {...props} />);
    expect(loadCode).not.toHaveBeenCalled();
    const details = container.querySelector("details")!;
    details.open = true;
    fireEvent(details, new Event("toggle"));
    const control = await screen.findByRole("textbox", { name: "Code state" });
    expect(loadCode).toHaveBeenCalledTimes(1);
    fireEvent.change(control, { target: { value: "retained" } });

    details.open = false;
    fireEvent(details, new Event("toggle"));
    expect(control).toBeInTheDocument();
    details.open = true;
    fireEvent(details, new Event("toggle"));
    expect(screen.getByRole("textbox", { name: "Code state" })).toHaveValue("retained");
    expect(loadCode).toHaveBeenCalledTimes(1);
  });
});
