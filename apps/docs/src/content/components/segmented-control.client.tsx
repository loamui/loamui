"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { SegmentedControl, VisuallyHidden } from "@loamui/core";
import {
  IconDeviceDesktop,
  IconSun,
  IconMoon,
  IconList,
  IconLayoutGrid,
} from "@tabler/icons-react";

const frame: CSSProperties = {
  display: "grid",
  gap: "var(--loam-space-xs)",
  justifyItems: "start",
};

function SystemIcon() {
  return <IconDeviceDesktop aria-hidden />;
}

function LightIcon() {
  return <IconSun aria-hidden />;
}

function DarkIcon() {
  return <IconMoon aria-hidden />;
}

function ListIcon() {
  return <IconList aria-hidden />;
}

function GridIcon() {
  return <IconLayoutGrid aria-hidden />;
}

type Scheme = "system" | "light" | "dark";

/**
 * A live scheme picker: choosing sets `data-theme` on the root element (or
 * removes it for System) and remembers the choice under the key this
 * site's pre-paint script reads.
 */
export function SegmentedControlSchemeDemo() {
  const [scheme, setScheme] = useState<Scheme>("system");
  useEffect(() => {
    const stored = localStorage.getItem("loamui-theme");
    if (stored === "light" || stored === "dark") setScheme(stored);
  }, []);
  const choose = (next: string) => {
    const value = next as Scheme;
    setScheme(value);
    if (value === "system") {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem("loamui-theme");
    } else {
      document.documentElement.dataset.theme = value;
      localStorage.setItem("loamui-theme", value);
    }
  };
  return (
    <SegmentedControl.Root value={scheme} onValueChange={choose}>
      <VisuallyHidden render={<SegmentedControl.Legend />}>Colour scheme</VisuallyHidden>
      <SegmentedControl.Item value="system">
        <SystemIcon />
        <VisuallyHidden>System</VisuallyHidden>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="light">
        <LightIcon />
        <VisuallyHidden>Light</VisuallyHidden>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="dark">
        <DarkIcon />
        <VisuallyHidden>Dark</VisuallyHidden>
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

/** Controlled: the view follows the value. */
export function SegmentedControlViewDemo() {
  const [view, setView] = useState("list");
  return (
    <div style={frame}>
      <SegmentedControl.Root value={view} onValueChange={setView}>
        <SegmentedControl.Legend>View</SegmentedControl.Legend>
        <SegmentedControl.Item value="list">
          <ListIcon />
          List
        </SegmentedControl.Item>
        <SegmentedControl.Item value="grid">
          <GridIcon />
          Grid
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <p style={{ margin: 0 }}>{view === "list" ? "Showing the list." : "Showing the grid."}</p>
    </div>
  );
}

/** A form control: the radios submit under `name`. */
export function SegmentedControlFormDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <form
      style={frame}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get("range")));
      }}
    >
      <SegmentedControl.Root name="range" defaultValue="week">
        <SegmentedControl.Legend>Range</SegmentedControl.Legend>
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
      </SegmentedControl.Root>
      <button type="submit">Apply</button>
      <p style={{ margin: 0 }} aria-live="polite">
        {submitted ? `Submitted range=${submitted}` : "Nothing submitted yet."}
      </p>
    </form>
  );
}

/** A disabled segment stays in the row, out of the choice; a disabled Root takes the whole group out. */
export function SegmentedControlDisabledDemo() {
  return (
    <div style={frame}>
      <SegmentedControl.Root defaultValue="monthly">
        <SegmentedControl.Legend>Billing</SegmentedControl.Legend>
        <SegmentedControl.Item value="monthly">Monthly</SegmentedControl.Item>
        <SegmentedControl.Item value="yearly">Yearly</SegmentedControl.Item>
        <SegmentedControl.Item value="lifetime" disabled>
          Lifetime
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <SegmentedControl.Root defaultValue="week" disabled>
        <SegmentedControl.Legend>Range</SegmentedControl.Legend>
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
      </SegmentedControl.Root>
    </div>
  );
}
