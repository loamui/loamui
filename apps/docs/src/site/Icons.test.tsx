import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import * as Icons from "./Icons";

describe("the site icons", () => {
  it("are all hidden from assistive technology", () => {
    for (const [name, Icon] of Object.entries(Icons)) {
      const { container, unmount } = render(<Icon />);
      expect(container.querySelector("svg"), name).toHaveAttribute("aria-hidden", "true");
      unmount();
    }
  });
});
