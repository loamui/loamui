import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { useScrollSpy } from "../hooks/use-scroll-spy.js";

afterEach(cleanup);

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

/** A mock observer: records what is observed and lets a test fire entries. */
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  observed: Element[] = [];
  disconnected = false;
  constructor(
    public callback: Callback,
    public options?: IntersectionObserverInit,
  ) {
    MockIntersectionObserver.instances.push(this);
  }
  observe(element: Element) {
    this.observed.push(element);
  }
  unobserve() {}
  disconnect() {
    this.disconnected = true;
  }
  takeRecords() {
    return [];
  }
}

function instance(index: number): MockIntersectionObserver {
  const observer = MockIntersectionObserver.instances[index];
  if (!observer) throw new Error(`No IntersectionObserver #${index}`);
  return observer;
}

function fire(observer: MockIntersectionObserver, states: Record<string, boolean>) {
  act(() => {
    observer.callback(
      Object.entries(states).map(([id, isIntersecting]) => ({
        target: document.getElementById(id) as Element,
        isIntersecting,
      })),
    );
  });
}

function Page(props: { ids: string[]; options?: { rootMargin?: string; threshold?: number } }) {
  const active = useScrollSpy(props.ids, props.options);
  return (
    <>
      <p data-testid="active">{active ?? "none"}</p>
      {props.ids.map((id) => (
        <h2 key={id} id={id}>
          {id}
        </h2>
      ))}
    </>
  );
}

describe("useScrollSpy", () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is null on the server and before anything intersects", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    expect(renderToStaticMarkup(<Page ids={["a", "b"]} />)).toContain("none");
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    render(<Page ids={["a", "b"]} />);
    expect(screen.getByTestId("active")).toHaveTextContent("none");
  });

  it("observes each id with the options and reports the first in view, in the given order", () => {
    render(<Page ids={["a", "b", "c"]} options={{ rootMargin: "0px 0px -70% 0px" }} />);
    const observer = instance(0);
    expect(observer.observed.map((el) => el.id)).toEqual(["a", "b", "c"]);
    expect(observer.options).toEqual({ rootMargin: "0px 0px -70% 0px", threshold: 0 });

    fire(observer, { b: true, c: true });
    expect(screen.getByTestId("active")).toHaveTextContent("b");

    fire(observer, { a: true });
    expect(screen.getByTestId("active")).toHaveTextContent("a");
  });

  it("keeps the last heading that was in view once none is", () => {
    render(<Page ids={["a", "b"]} />);
    const observer = instance(0);
    fire(observer, { a: true, b: false });
    fire(observer, { a: false });
    expect(screen.getByTestId("active")).toHaveTextContent("a");
    fire(observer, { b: true });
    expect(screen.getByTestId("active")).toHaveTextContent("b");
  });

  it("does not re-observe for a fresh array of the same ids, and disconnects on unmount", () => {
    const { rerender, unmount } = render(<Page ids={["a", "b"]} options={{ threshold: 0.5 }} />);
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    rerender(<Page ids={["a", "b"]} options={{ threshold: 0.5 }} />);
    expect(MockIntersectionObserver.instances).toHaveLength(1);

    rerender(<Page ids={["a", "b", "c"]} options={{ threshold: 0.5 }} />);
    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(instance(0).disconnected).toBe(true);

    unmount();
    expect(instance(1).disconnected).toBe(true);
  });
});
