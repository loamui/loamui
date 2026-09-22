import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Carousel } from "../components/Carousel/index.js";
import { Card } from "../components/Card/Card.js";

afterEach(cleanup);

// Colour contrast is covered live in Storybook; jsdom has no canvas for it.
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

// jsdom has no IntersectionObserver and no layout. This double records
// what the Root observes and lets a test hand it the ratios a browser
// would: 1 for an item wholly in view, 0.5 for half, 0 for none.
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly targets = new Set<Element>();
  constructor(readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }
  observe(el: Element) {
    this.targets.add(el);
  }
  unobserve(el: Element) {
    this.targets.delete(el);
  }
  disconnect() {
    this.targets.clear();
  }
  takeRecords() {
    return [];
  }
}

function settle(ratios: number[]) {
  const observer = FakeIntersectionObserver.instances.at(-1)!;
  const items = screen.getAllByRole("listitem").filter((el) => observer.targets.has(el));
  const entries = items.map(
    (target, i) =>
      ({
        target,
        intersectionRatio: ratios[i] ?? 0,
        isIntersecting: (ratios[i] ?? 0) > 0,
      }) as unknown as IntersectionObserverEntry,
  );
  act(() => {
    observer.callback(entries, observer as unknown as IntersectionObserver);
  });
}

beforeEach(() => {
  FakeIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const GUIDES = ["Tokens", "Element styles", "Components", "Contextualism", "Accessibility"];

function Guides(props: { loop?: boolean; indicators?: boolean }) {
  return (
    <Carousel.Root aria-labelledby="guides" loop={props.loop}>
      <h2 id="guides">Guides</h2>
      <Carousel.Track>
        {GUIDES.map((title) => (
          <Carousel.Item key={title}>
            <Card>
              <h3>{title}</h3>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel.Track>
      <div>
        <Carousel.Previous />
        <Carousel.Next />
      </div>
      {props.indicators && <Carousel.Indicators />}
    </Carousel.Root>
  );
}

/** The track with a mocked width and scroll API, since jsdom lays nothing out. */
function track(width = 400) {
  const el = document.querySelector("ul.track") as HTMLUListElement;
  Object.defineProperty(el, "clientWidth", { value: width, configurable: true });
  Object.defineProperty(el, "scrollWidth", { value: width * 3, configurable: true });
  const scrollBy = vi.fn();
  const scrollTo = vi.fn();
  el.scrollBy = scrollBy;
  el.scrollTo = scrollTo;
  return { el, scrollBy, scrollTo };
}

describe("Carousel", () => {
  it("is a named carousel region over a list, with no axe violations", async () => {
    const { container } = render(<Guides indicators />);
    const region = screen.getByRole("region", { name: "Guides" });
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(region).not.toHaveAttribute("aria-label");
    const list = container.querySelector("ul.track")!;
    expect(list).toHaveAttribute("tabindex", "0");
    expect(list.querySelectorAll(":scope > li")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("names itself from labels.region when the consumer passes no name", () => {
    render(
      <Carousel.Root labels={{ region: "Carrousel" }}>
        <Carousel.Track>
          <Carousel.Item>One</Carousel.Item>
        </Carousel.Track>
      </Carousel.Root>,
    );
    expect(screen.getByRole("region", { name: "Carrousel" })).toBeInTheDocument();
  });

  it("pages by one width of the track from the buttons, in reading order", () => {
    render(<Guides />);
    const { scrollBy } = track(400);
    settle([0.5, 0.5, 0, 0, 0]);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 400 });

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -400 });
  });

  it("disables Previous at the start and Next at the end, keeping the button focusable", () => {
    render(<Guides />);
    const { scrollBy } = track();
    const previous = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });

    settle([1, 1, 0.3, 0, 0]);
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(next).not.toHaveAttribute("aria-disabled");
    fireEvent.click(previous);
    expect(scrollBy).not.toHaveBeenCalled();
    expect(previous).not.toBeDisabled();

    settle([0, 0, 0.3, 1, 1]);
    expect(previous).not.toHaveAttribute("aria-disabled");
    expect(next).toHaveAttribute("aria-disabled", "true");

    settle([1, 1, 1, 1, 1]);
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(next).toHaveAttribute("aria-disabled", "true");
  });

  it("wraps around at the ends with loop instead of disabling", () => {
    render(<Guides loop />);
    const { scrollBy, scrollTo } = track(400);
    const previous = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });

    settle([1, 1, 0, 0, 0]);
    expect(previous).not.toHaveAttribute("aria-disabled");
    fireEvent.click(previous);
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 1200 });

    settle([0, 0, 0, 1, 1]);
    expect(next).not.toHaveAttribute("aria-disabled");
    fireEvent.click(next);
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("is a keyboard scroller: Tab reaches the track and the arrow keys page it", async () => {
    const user = userEvent.setup();
    render(<Guides />);
    const { el, scrollBy, scrollTo } = track(300);
    settle([0, 1, 1, 0, 0]);

    await user.tab();
    expect(el).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300 });
    await user.keyboard("{ArrowLeft}");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -300 });
    await user.keyboard("{End}");
    expect(scrollTo).toHaveBeenCalledTimes(1);
    await user.keyboard("{Home}");
    expect(scrollTo).toHaveBeenCalledTimes(2);

    await user.tab();
    expect(screen.getByRole("button", { name: "Previous" })).toHaveFocus();
  });

  it("leaves the arrow keys alone when focus is inside an item", async () => {
    const user = userEvent.setup();
    render(
      <Carousel.Root labels={{ region: "Forms" }}>
        <Carousel.Track>
          <Carousel.Item>
            <input aria-label="Name" />
          </Carousel.Item>
        </Carousel.Track>
      </Carousel.Root>,
    );
    const { scrollBy } = track();
    await user.click(screen.getByRole("textbox", { name: "Name" }));
    await user.keyboard("{ArrowRight}");
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("marks the current indicator from the scroll position and scrolls to an item on click", () => {
    render(<Guides indicators />);
    const { el, scrollTo } = track(400);
    const dots = screen.getAllByRole("button", { name: /Go to slide/ });
    expect(dots).toHaveLength(5);
    expect(dots[2]).toHaveAccessibleName("Go to slide 3 of 5");
    expect(dots[0]!.closest("ul")).toHaveAttribute("role", "list");

    settle([1, 1, 0.2, 0, 0]);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[1]).not.toHaveAttribute("aria-current");

    settle([0, 0.4, 1, 1, 0.2]);
    expect(dots[0]).not.toHaveAttribute("aria-current");
    expect(dots[2]).toHaveAttribute("aria-current", "true");

    const item = screen.getAllByRole("listitem")[3]!;
    el.getBoundingClientRect = () => ({ left: 100, right: 500 }) as DOMRect;
    item.getBoundingClientRect = () => ({ left: 700, right: 900 }) as DOMRect;
    Object.defineProperty(el, "scrollLeft", { value: 400, configurable: true });
    fireEvent.click(dots[3]!);
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 1000 });
  });

  it("announces the position once the track settles, and only after it has moved", () => {
    vi.useFakeTimers();
    try {
      render(<Guides />);
      const status = screen.getByRole("status");
      settle([1, 1, 0, 0, 0]);
      act(() => vi.runAllTimers());
      expect(status).toHaveTextContent("");

      settle([0, 1, 1, 0, 0]);
      settle([0, 0, 1, 1, 0]);
      act(() => vi.runAllTimers());
      expect(status).toHaveTextContent("Slide 3 of 5");
    } finally {
      vi.useRealTimers();
    }
  });

  it("replaces the default strings through labels", () => {
    vi.useFakeTimers();
    try {
      render(
        <Carousel.Root
          labels={{
            region: "Guides",
            previous: "Précédent",
            next: "Suivant",
            indicator: (i, n) => `Diapositive ${i} sur ${n}`,
            status: (i, n) => `Diapositive ${i} sur ${n}`,
          }}
        >
          <Carousel.Track>
            <Carousel.Item>One</Carousel.Item>
            <Carousel.Item>Two</Carousel.Item>
          </Carousel.Track>
          <Carousel.Previous />
          <Carousel.Next />
          <Carousel.Indicators />
        </Carousel.Root>,
      );
      expect(screen.getByRole("button", { name: "Précédent" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Suivant" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Diapositive 2 sur 2" })).toBeInTheDocument();
      settle([1, 0]);
      settle([0, 1]);
      act(() => vi.runAllTimers());
      expect(screen.getByRole("status")).toHaveTextContent("Diapositive 2 sur 2");
    } finally {
      vi.useRealTimers();
    }
  });

  it("points the default chevrons toward the start and the end in both directions", () => {
    render(<Guides />);
    // jsdom cannot match :dir(), so the mirror is checked in the stylesheet
    // and the DOM is checked for the scope root the rule hangs from.
    const previous = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });
    expect(previous).toHaveClass("loam-Carousel-control");
    expect(next).toHaveClass("loam-Carousel-control");
    expect(previous.querySelector("svg polyline")).toHaveAttribute("points", "15 18 9 12 15 6");
    expect(next.querySelector("svg polyline")).toHaveAttribute("points", "9 18 15 12 9 6");

    const css = readFileSync(resolve(__dirname, "../components/Carousel/Carousel.css"), "utf8");
    const control = css.slice(css.indexOf("@scope (.loam-Carousel-control)"));
    expect(control).toMatch(/svg:dir\(rtl\)\s*{[^}]*scale: -1 1;/);
  });

  it("paints an aria-disabled button as unavailable, in GrayText under forced colours", () => {
    // Button's own rule keys off :disabled, which these buttons never carry.
    const css = readFileSync(resolve(__dirname, "../components/Carousel/Carousel.css"), "utf8");
    const control = css.slice(css.indexOf("@scope (.loam-Carousel-control)"));
    expect(control).toMatch(
      /:scope\[aria-disabled="true"\]\s*{[^}]*opacity: var\(--loam-disabled-opacity\)/,
    );
    const forced = control.slice(control.indexOf("@media (forced-colors: active)"));
    expect(forced).toMatch(/:scope\[aria-disabled="true"\]\s*{[^}]*color: GrayText/);
  });

  it("lets children name a button and render substitute the item and the buttons", () => {
    render(
      <Carousel.Root labels={{ region: "Guides" }}>
        <Carousel.Track>
          <Carousel.Item render={<li data-kind="figure" />}>One</Carousel.Item>
        </Carousel.Track>
        <Carousel.Next>Suivant</Carousel.Next>
        <Carousel.Previous render={(props) => <a href="#start" {...props} />} />
      </Carousel.Root>,
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("data-kind", "figure");
    const next = screen.getByRole("button", { name: "Suivant" });
    expect(next).not.toHaveAttribute("aria-label");
    const previous = screen.getByRole("link", { name: "Previous" });
    expect(previous).toHaveAttribute("href", "#start");
  });

  it("refuses a part outside a Root", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Carousel.Track />)).toThrow(
      "Carousel.Track must be rendered inside <Carousel.Root>.",
    );
    expect(() => render(<Carousel.Next />)).toThrow(
      "Carousel.Next must be rendered inside <Carousel.Root>.",
    );
    error.mockRestore();
  });
});
