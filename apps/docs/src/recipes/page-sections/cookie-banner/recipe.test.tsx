import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { axe } from "vitest-axe";
import Recipe from "./Recipe";

afterEach(cleanup);
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("cookie-banner", () => {
  it("is a named region whose choice becomes an announced confirmation that takes focus, then hides", async () => {
    const { container } = render(<Recipe />);
    const region = screen.getByRole("region", { name: "Cookies on Hedgerow" });
    expect(region).toHaveClass("cookie-banner");
    const status = screen.getByRole("status");
    expect(status).toBeEmptyDOMElement();
    const reject = screen.getByRole("button", { name: "Reject additional cookies" });
    expect(reject).toHaveAttribute("type", "submit");
    expect(reject.closest("form")).toHaveAttribute("method", "post");
    expect(await axe(container, axeOptions)).toHaveNoViolations();

    await act(async () => {
      fireEvent.click(reject);
    });
    expect(status).toHaveTextContent(/You have rejected additional cookies/);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    const hide = screen.getByRole("button", { name: "Hide this message" });
    expect(hide).toHaveFocus();

    fireEvent.click(hide);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
