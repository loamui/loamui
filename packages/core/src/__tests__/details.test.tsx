import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Details } from "../components/Details/index.js";

afterEach(cleanup);

/**
 * `defaultOpen` is spelled with React's `open` prop, which React treats as
 * controlled. It behaves as a default only because the prop never changes —
 * so this pins that, rather than leaving it to be discovered by a regression.
 */
describe("Details", () => {
  it("keeps defaultOpen a default: a parent re-render does not reopen it", async () => {
    const user = userEvent.setup();
    function Host() {
      const [n, setN] = useState(0);
      return (
        <>
          <button onClick={() => setN(n + 1)}>rerender {n}</button>
          <Details.Root defaultOpen>
            <Details.Summary>More</Details.Summary>
            <Details.Content>Body</Details.Content>
          </Details.Root>
        </>
      );
    }
    render(<Host />);
    const d = document.querySelector("details")!;
    expect(d.open).toBe(true);

    await user.click(screen.getByText("More"));
    expect(d.open).toBe(false);

    // a re-render of the parent must not reopen it
    await user.click(screen.getByRole("button", { name: /rerender/ }));
    expect(d.open).toBe(false);
  });
});
