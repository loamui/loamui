"use client";

import { useEffect, useState } from "react";

type TokenGroup = {
  title: string;
  note: string;
  tokens: string[];
  swatch?: boolean;
  shadow?: boolean;
};

const GROUPS: TokenGroup[] = [
  {
    title: "Brand & status",
    note: "The colour decisions a theme makes. Primary is neutral (black/white) by default, the white-label starting point; accent is the chromatic flourish; success/danger/warning/info are the status hues; link and highlight round out the platform defaults.",
    tokens: [
      "--loam-color-primary",
      "--loam-color-accent",
      "--loam-color-success",
      "--loam-color-danger",
      "--loam-color-warning",
      "--loam-color-info",
      "--loam-color-link",
      "--loam-color-highlight",
    ],
    swatch: true,
  },
  {
    title: "Neutrals",
    note: "Surfaces, text and borders.",
    tokens: [
      "--loam-color-bg",
      "--loam-color-bg-subtle",
      "--loam-color-surface",
      "--loam-color-fg",
      "--loam-color-fg-strong",
      "--loam-color-fg-muted",
      "--loam-color-fg-dim",
      "--loam-color-line",
      "--loam-color-line-strong",
      "--loam-color-on-strong",
    ],
    swatch: true,
  },
  {
    title: "Derived",
    note: "Each hue derives its soft tint and solid fill through the same formulas. The focus ring uses the solid fill. Rebrand a hue and its family follows.",
    tokens: [
      "--loam-color-primary-soft",
      "--loam-color-primary-strong",
      "--loam-color-success-soft",
      "--loam-color-success-strong",
      "--loam-color-danger-soft",
      "--loam-color-danger-strong",
      "--loam-color-warning-soft",
      "--loam-color-warning-strong",
      "--loam-color-info-soft",
      "--loam-color-info-strong",
      "--loam-color-surface-hover",
      "--loam-color-ring",
    ],
    swatch: true,
  },
  {
    title: "Fonts",
    note: "Two families a theme can swap (body and display), plus a monospace for code. System by default.",
    tokens: ["--loam-font", "--loam-font-display", "--loam-font-mono"],
  },
  {
    title: "Type scale",
    note: "Fluid clamp() values in container units: they respond to the nearest container, or the viewport without one.",
    tokens: [
      "--loam-text-xs",
      "--loam-text-sm",
      "--loam-text-md",
      "--loam-text-lg",
      "--loam-text-xl",
      "--loam-text-2xl",
      "--loam-text-3xl",
    ],
  },
  {
    title: "Spacing",
    note: "The same fluid construction, growing against the container rather than the viewport; minimums are the fixed values, so nothing shrinks below them.",
    tokens: [
      "--loam-space-4xs",
      "--loam-space-3xs",
      "--loam-space-2xs",
      "--loam-space-xs",
      "--loam-space-s",
      "--loam-space-m",
      "--loam-space-l",
      "--loam-space-xl",
      "--loam-space-2xl",
      "--loam-space-3xl",
      "--loam-space-4xl",
    ],
  },
  {
    title: "Fixed spacing",
    note: "The deliberate opposite: for a hairline, a ring inset, the gap beside an icon. Reach for the fluid scale first.",
    tokens: [
      "--loam-space-fixed-1",
      "--loam-space-fixed-2",
      "--loam-space-fixed-4",
      "--loam-space-fixed-8",
      "--loam-space-fixed-12",
      "--loam-space-fixed-16",
      "--loam-space-fixed-24",
      "--loam-space-fixed-32",
    ],
  },
  {
    title: "Radius & motion",
    note: "Deliberately fixed: rounding and durations don't breathe with the viewport.",
    tokens: [
      "--loam-radius-sm",
      "--loam-radius-md",
      "--loam-radius-lg",
      "--loam-radius-xl",
      "--loam-radius-full",
      "--loam-duration-sm",
      "--loam-duration-md",
      "--loam-duration-lg",
      "--loam-ease",
      "--loam-ease-elastic",
    ],
  },
  {
    title: "Elevation",
    note: "Layered light-dark() shadows: a real drop in light; in dark the drop goes transparent and an inset top highlight carries the bevel, so the light source stays consistent.",
    tokens: ["--loam-shadow-sm", "--loam-shadow-raised", "--loam-shadow-md", "--loam-shadow-lg"],
    shadow: true,
  },
];

/**
 * The token table is measured, not transcribed: values are read live from
 * the loaded stylesheet with getComputedStyle, so the page cannot drift
 * from the shipped CSS.
 */
export function ComputedTokens() {
  const [values, setValues] = useState<Record<string, string>>();

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const all: Record<string, string> = {};
    for (const g of GROUPS) {
      for (const t of g.tokens) {
        all[t] = cs.getPropertyValue(t).trim();
      }
    }
    setValues(all);
  }, []);

  return (
    <div style={{ display: "grid", gap: "var(--loam-space-xl)" }}>
      {GROUPS.map((g) => (
        <section key={g.title} style={{ minInlineSize: 0 }}>
          <h3 style={{ marginBlockEnd: "var(--loam-space-3xs)" }}>{g.title}</h3>
          <p
            style={{ color: "var(--loam-color-fg-muted)", marginBlockEnd: "var(--loam-space-xs)" }}
          >
            {g.note}
          </p>
          <div
            style={{
              border: "1px solid var(--loam-color-line)",
              borderRadius: "var(--loam-radius-md)",
              overflow: "clip",
            }}
          >
            {g.tokens.map((t, i) => (
              <div
                key={t}
                style={{
                  alignItems: "baseline",
                  borderBlockStart: i > 0 ? "1px solid var(--loam-color-line)" : undefined,
                  display: "flex",
                  fontFamily: "var(--loam-font-mono)",
                  fontSize: "var(--loam-text-sm)",
                  gap: "var(--loam-space-xs)",
                  padding: "var(--loam-space-2xs) var(--loam-space-xs)",
                }}
              >
                {g.swatch && (
                  <span
                    aria-hidden
                    style={{
                      background: `var(${t})`,
                      blockSize: "1.25rem",
                      border: "1px solid var(--loam-color-line)",
                      borderRadius: "var(--loam-radius-sm)",
                      display: "inline-block",
                      flexShrink: 0,
                      inlineSize: "1.25rem",
                    }}
                  />
                )}
                {g.shadow && (
                  <span
                    aria-hidden
                    style={{
                      background: "var(--loam-color-surface)",
                      blockSize: "1.75rem",
                      borderRadius: "var(--loam-radius-sm)",
                      boxShadow: `var(${t})`,
                      display: "inline-block",
                      flexShrink: 0,
                      inlineSize: "1.75rem",
                    }}
                  />
                )}
                <span style={{ flexShrink: 0 }}>{t}</span>
                <span
                  style={{
                    color: "var(--loam-color-fg-muted)",
                    fontSize: "var(--loam-text-xs)",
                    marginInlineStart: "auto",
                    minInlineSize: 0,
                    overflowWrap: "anywhere",
                    textAlign: "end",
                  }}
                >
                  {values?.[t] ?? "…"}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
      <p style={{ color: "var(--loam-color-fg-muted)", fontSize: "var(--loam-text-sm)" }}>
        Values are read live from the loaded stylesheet with getComputedStyle, in your current
        colour scheme; fluid values show their computed size at this viewport.
      </p>
    </div>
  );
}
