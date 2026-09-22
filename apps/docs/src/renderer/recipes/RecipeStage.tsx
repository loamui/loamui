"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { VisuallyHidden } from "@loamui/core";
import { useSiteScheme } from "./use-site-scheme";
import "./RecipeStage.css";
import {
  IconSun,
  IconMoon,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDeviceDesktop,
  IconMaximize,
  IconExternalLink,
} from "@tabler/icons-react";

type Scheme = "light" | "dark";
type Width = "narrow" | "medium" | "wide" | "full";

interface StageState {
  /** A scheme pinned for the frame; null follows the page. */
  scheme: Scheme | null;
  width: Width;
  rtl: boolean;
}

const STORAGE_KEY = "loamui-examples-stage";
const DEFAULT: StageState = { scheme: null, width: "full", rtl: false };

const WIDTHS: { value: Width; label: string }[] = [
  { value: "narrow", label: "Phone width" },
  { value: "medium", label: "Tablet width" },
  { value: "wide", label: "Laptop width" },
  { value: "full", label: "Full width" },
];

/**
 * Settings live for the visit, not for ever: a frame pinned narrow last
 * month would puzzle a reader back for something else.
 */
function load(): StageState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<StageState>;
    return {
      scheme: parsed.scheme === "light" || parsed.scheme === "dark" ? parsed.scheme : null,
      width: WIDTHS.some((w) => w.value === parsed.width) ? (parsed.width as Width) : "full",
      rtl: parsed.rtl === true,
    };
  } catch {
    return DEFAULT;
  }
}

function save(state: StageState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode, quota: the toolbar still works for this page */
  }
}

function SunIcon() {
  return <IconSun size={16} aria-hidden />;
}

function MoonIcon() {
  return <IconMoon size={16} aria-hidden />;
}

function WidthIcon({ value }: { value: Width }) {
  switch (value) {
    case "narrow":
      return <IconDeviceMobile size={16} aria-hidden />;
    case "medium":
      return <IconDeviceTablet size={16} aria-hidden />;
    case "wide":
      return <IconDeviceDesktop size={16} aria-hidden />;
    default:
      return <IconMaximize size={16} aria-hidden />;
  }
}

function OpenIcon() {
  return <IconExternalLink size={16} aria-hidden />;
}

/**
 * The live example inside a styled container with its own controls: a
 * colour scheme pinned to the frame alone (data-theme sets color-scheme
 * for the subtree, so every light-dark() token re-resolves inside it),
 * width presets so the container queries answer without a window resize,
 * and a direction toggle that proves the logical properties. The frame is
 * a container, so the example's fluid tokens answer the frame, not the
 * viewport. Settings persist for the session and are read after mount, so
 * the server render is the default and hydration never mismatches.
 */
export function RecipeStage({
  title,
  href,
  children,
}: {
  /** Names the frame for assistive technology. */
  title: string;
  /** The example's own page; omitted on that page. */
  href?: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<StageState>(DEFAULT);
  const site = useSiteScheme();
  const widthName = useId();
  const scheme = state.scheme ?? site;

  useEffect(() => {
    setState(load());
  }, []);

  const update = (patch: Partial<StageState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  };

  const flipScheme = () => {
    const next: Scheme = scheme === "dark" ? "light" : "dark";
    // Back to following the page when the pin would equal what the page
    // already shows, so the frame tracks the site's toggle afterwards.
    update({ scheme: next === site ? null : next });
  };

  const schemeLabel = scheme === "dark" ? "Show the frame in light" : "Show the frame in dark";

  return (
    <div className="site-RecipeStage">
      <div className="toolbar" role="group" aria-label={`Preview controls for ${title}`}>
        <fieldset>
          <VisuallyHidden render={<legend />}>Preview width</VisuallyHidden>
          {WIDTHS.map((w) => (
            <label key={w.value} title={w.label}>
              <VisuallyHidden
                render={
                  <input
                    type="radio"
                    name={widthName}
                    value={w.value}
                    checked={state.width === w.value}
                    onChange={() => update({ width: w.value })}
                  />
                }
              />
              <WidthIcon value={w.value} />
              <VisuallyHidden>{w.label}</VisuallyHidden>
            </label>
          ))}
        </fieldset>
        <div className="options">
          <button
            type="button"
            aria-pressed={state.rtl}
            onClick={() => update({ rtl: !state.rtl })}
            title="Right-to-left layout"
            aria-label="Right-to-left layout"
          >
            RTL
          </button>
          <button type="button" title={schemeLabel} onClick={flipScheme}>
            {scheme === "dark" ? <MoonIcon /> : <SunIcon />}
            <VisuallyHidden>{schemeLabel}</VisuallyHidden>
          </button>
        </div>
        {href && (
          <Link href={href} title="Open on its own page">
            <OpenIcon />
            <VisuallyHidden>Open {title} on its own page</VisuallyHidden>
          </Link>
        )}
      </div>
      <div className="stage" data-width={state.width}>
        <div
          className="frame"
          data-theme={state.scheme ?? undefined}
          dir={state.rtl ? "rtl" : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
