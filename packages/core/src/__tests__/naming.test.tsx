import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import { useNamedRoot, useNamePart, useOptionalSlot } from "../hooks/use-naming.js";

afterEach(cleanup);

// A minimal composition in the shape the hooks are written for: a section
// named by an optional heading part.
type NameContext = { nameId: string; register: (id: string) => () => void } | null;
const Naming = createContext<NameContext>(null);

function Root({
  fallback,
  children,
  ...props
}: {
  fallback?: string;
  children?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const { nameId, register, labelling } = useNamedRoot(props, fallback);
  const naming = useMemo(() => ({ nameId, register }), [nameId, register]);
  return (
    <Naming value={naming}>
      <section {...props} {...labelling}>
        {children}
      </section>
    </Naming>
  );
}

function Title({ id, children }: { id?: string; children: ReactNode }) {
  const titleId = useNamePart(useContext(Naming), id);
  return <h2 id={titleId}>{children}</h2>;
}

describe("useNamedRoot / useNamePart", () => {
  it("emits aria-labelledby in the first render, so the server HTML is named", () => {
    const html = renderToString(
      <Root>
        <Title>Pricing</Title>
      </Root>,
    );
    const labelledby = html.match(/aria-labelledby="([^"]+)"/)?.[1];
    expect(labelledby).toBeTruthy();
    expect(html).toContain(`id="${labelledby}"`);
  });

  it("keeps the reference when the Title mounts", () => {
    render(
      <Root>
        <Title>Pricing</Title>
      </Root>,
    );
    const region = screen.getByRole("region", { name: "Pricing" });
    expect(region).toHaveAttribute("aria-labelledby", screen.getByRole("heading").id);
  });

  it("drops a dangling reference and falls back when there is no Title", () => {
    const { container, rerender } = render(<Root fallback="Plans" />);
    expect(container.firstElementChild).not.toHaveAttribute("aria-labelledby");
    expect(screen.getByRole("region", { name: "Plans" })).toBeInTheDocument();

    rerender(<Root />);
    expect(container.firstElementChild).not.toHaveAttribute("aria-labelledby");
    expect(container.firstElementChild).not.toHaveAttribute("aria-label");
  });

  it("lets the consumer's own name win, and honours the Title's own id", () => {
    render(
      <>
        <Root aria-label="Our plans">
          <Title>Pricing</Title>
        </Root>
        <Root aria-labelledby="elsewhere">
          <Title>Pricing</Title>
        </Root>
        <Root>
          <Title id="my-title">Pricing</Title>
        </Root>
      </>,
    );
    const [labelled, referenced, own] = screen.getAllByRole("region");
    expect(labelled).toHaveAccessibleName("Our plans");
    expect(labelled).not.toHaveAttribute("aria-labelledby");
    expect(referenced).toHaveAttribute("aria-labelledby", "elsewhere");
    expect(own).toHaveAttribute("aria-labelledby", "my-title");
  });
});

const Slot = createContext<{ id: string; register: () => () => void } | null>(null);

function Owner({ children }: { children?: ReactNode }) {
  const slot = useOptionalSlot();
  return (
    <Slot value={slot}>
      <button type="button" aria-describedby={slot.ref}>
        Save
      </button>
      {children}
    </Slot>
  );
}

function Hint({ children }: { children: ReactNode }) {
  const slot = useContext(Slot)!;
  useNamePart({ nameId: slot.id, register: () => slot.register() });
  return <p id={slot.id}>{children}</p>;
}

describe("useOptionalSlot", () => {
  it("references the slot in the first render and keeps it once the part registers", () => {
    const html = renderToString(
      <Owner>
        <Hint>Saves a draft</Hint>
      </Owner>,
    );
    expect(html).toMatch(/aria-describedby="[^"]+"/);

    render(
      <Owner>
        <Hint>Saves a draft</Hint>
      </Owner>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleDescription("Saves a draft");
  });

  it("drops the reference after mount when nothing registers", () => {
    render(<Owner />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-describedby");
  });
});
