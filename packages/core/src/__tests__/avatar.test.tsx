import { StrictMode, createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { axe } from "vitest-axe";
import { Avatar } from "../components/Avatar/index.js";

afterEach(cleanup);
const portrait = "/ada.png";
function Person({ src = portrait, showImage = true }) {
  return (
    <Avatar.Root role="img" aria-label="Ada Lovelace">
      {showImage && <Avatar.Image src={src} alt="" loading="lazy" />}
      <Avatar.Fallback>AL</Avatar.Fallback>
    </Avatar.Root>
  );
}

describe("Avatar composition", () => {
  it("renders caller-supplied fallback content without an image", () => {
    render(<Person showImage={false} />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent("AL");
    expect(screen.getByText("AL")).toBeVisible();
  });
  it("keeps native image attributes and both parts in server HTML", () => {
    const doc = new DOMParser().parseFromString(renderToString(<Person />), "text/html");
    expect(doc.querySelector("img")?.getAttribute("src")).toBe(portrait);
    expect(doc.querySelector("img")?.getAttribute("loading")).toBe("lazy");
    expect(doc.querySelector("img")?.hasAttribute("data-loading")).toBe(true);
    expect(doc.querySelector(".fallback")?.hasAttribute("hidden")).toBe(false);
  });
  it("hides the fallback after loading and restores it after an error", () => {
    const onLoad = vi.fn(),
      onError = vi.fn();
    const ref = createRef<HTMLImageElement>();
    const { container } = render(
      <Avatar.Root role="img" aria-label="Ada Lovelace">
        <Avatar.Fallback>AL</Avatar.Fallback>
        <Avatar.Image src={portrait} alt="" ref={ref} onLoad={onLoad} onError={onError} />
      </Avatar.Root>,
    );
    const image = container.querySelector("img")!;
    expect(ref.current).toBe(image);
    fireEvent.load(image);
    expect(screen.getByText("AL")).not.toBeVisible();
    expect(onLoad).toHaveBeenCalledOnce();
    fireEvent.error(image);
    expect(screen.getByText("AL")).toBeVisible();
    expect(image).toHaveAttribute("data-error");
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
  });
  it("retries changed sources and clears the previous image state", () => {
    const { container, rerender } = render(
      <StrictMode>
        <Person />
      </StrictMode>,
    );
    fireEvent.error(container.querySelector("img")!);
    rerender(
      <StrictMode>
        <Person src="/new.png" />
      </StrictMode>,
    );
    const image = container.querySelector("img")!;
    expect(image).toHaveAttribute("src", "/new.png");
    expect(image).toHaveAttribute("data-loading");
    expect(image).not.toHaveAttribute("data-error");
    fireEvent.load(image);
    expect(screen.getByText("AL")).not.toBeVisible();
    rerender(
      <StrictMode>
        <Person showImage={false} />
      </StrictMode>,
    );
    expect(screen.getByText("AL")).toBeVisible();
  });
  it("recognizes an image loaded before hydration", () => {
    const complete = vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    const currentSrc = vi
      .spyOn(HTMLImageElement.prototype, "currentSrc", "get")
      .mockReturnValue(portrait);
    const width = vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(96);
    try {
      render(<Person />);
      expect(screen.getByText("AL")).not.toBeVisible();
    } finally {
      complete.mockRestore();
      currentSrc.mockRestore();
      width.mockRestore();
    }
  });
  it("accepts decorative avatars without announcing initials", () => {
    render(
      <Avatar.Root aria-hidden>
        <Avatar.Image src={portrait} alt="" />
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("groups explicit avatars, including a caller-written overflow count", async () => {
    const { container } = render(
      <Avatar.Group aria-label="Participants">
        <Person showImage={false} />
        <Avatar.Root role="img" aria-label="5 more people">
          <Avatar.Fallback>+5</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "5 more people" })).toHaveTextContent("+5");
    expect(
      await axe(container, { rules: { "color-contrast": { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
