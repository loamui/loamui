import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Footer } from "./Footer";

const axeOptions = { rules: { "color-contrast": { enabled: false } } };
afterEach(cleanup);

describe("the footer", () => {
  it("is a landmark holding a named nav and the markdown index", async () => {
    const { container } = render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Markdown documentation/ })).toHaveAttribute(
      "href",
      "/llms.txt",
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
