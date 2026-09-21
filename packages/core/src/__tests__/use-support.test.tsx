import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { useLayoutEffect, useRef } from "react";

import { useHydrated, useSupports } from "../hooks/use-support.js";

afterEach(cleanup);

function Probe({ seen }: { seen?: string[] }) {
  const supported = useSupports(() => true);
  const ref = useRef<HTMLSpanElement>(null);
  // What the first commit painted, before any effect could correct it.
  useLayoutEffect(() => {
    seen?.push(ref.current?.textContent ?? "");
  }, [seen]);
  return <span ref={ref}>{supported ? "enhanced" : "fallback"}</span>;
}

describe("useSupports", () => {
  it("answers false on the server, so the markup is the fallback", () => {
    expect(renderToString(<Probe />)).toContain("fallback");
  });

  it("answers the probe from the first client render, with no fallback flash", () => {
    const seen: string[] = [];
    const { container } = render(<Probe seen={seen} />);
    expect(seen).toEqual(["enhanced"]);
    expect(container.textContent).toBe("enhanced");
  });
});

describe("useHydrated", () => {
  function Hydrated() {
    return <span>{useHydrated() ? "client" : "server"}</span>;
  }

  it("is false on the server and true on the client", () => {
    expect(renderToString(<Hydrated />)).toContain("server");
    const { container } = render(<Hydrated />);
    expect(container.textContent).toBe("client");
  });
});
