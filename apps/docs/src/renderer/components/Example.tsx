import type { CSSProperties, ReactNode } from "react";

/**
 * A captioned example inside a Preview panel. The caption is preview-only
 * stage dressing — it labels what a variant demonstrates so a human can read
 * a multi-example panel at a glance, and it is never mirrored in the Code
 * tab (which shows the real component usage). Use it only when a panel holds
 * more than one example, or when the point isn't visible in a static shot.
 */
export function Example({
  label,
  children,
  style,
}: {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "grid", gap: "var(--loam-space-2xs)", justifyItems: "start", ...style }}>
      <span
        style={{
          color: "var(--loam-color-fg-muted)",
          fontSize: "var(--loam-text-xs)",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
