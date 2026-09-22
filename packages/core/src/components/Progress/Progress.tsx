"use client";

import type { ReactNode } from "react";
import { useEffect, useId } from "react";
import { cx } from "../../utils/cx.js";
import type { LoamUISize, PartProps } from "../../utils/props.js";

/** The words a Progress speaks. */
export interface ProgressLabels {
  /**
   * Writes the value: the fallback text for a browser without `<progress>`
   * and, when given, the value assistive technology reads (`aria-valuetext`).
   * @default the value as a percentage in the page's number format
   */
  value?: (n: number) => string;
}

export interface ProgressProps extends Omit<PartProps<"progress">, "color" | "value" | "max"> {
  /** Fill amount, 0–100. Omit it for an indeterminate bar: work under way, amount unknown. */
  value?: number;
  /** Track thickness. @default "md" */
  size?: LoamUISize;
  /** Overlay diagonal stripes on the filled bar. */
  striped?: boolean;
  /** Animate the stripes (implies `striped`). */
  animated?: boolean;
  /**
   * The words for the value: `value(n)` writes the fallback text for a
   * browser without `<progress>`, and, when given, the value assistive
   * technology reads (`aria-valuetext`) in place of the bare percentage.
   * @default the value as a percentage in the page's number format
   */
  labels?: ProgressLabels;
  /**
   * The visible label, beside the bar: it names what is progressing and
   * becomes the bar's accessible name. Without it, pass `aria-label` or
   * `aria-labelledby`.
   */
  children?: ReactNode;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * A horizontal bar showing completion of a task, on the native `<progress>`.
 *
 * The bar fills with the primary colour, re-answered by any --loam-context
 * region: declare `--loam-context` on a region (an ancestor — a style
 * query never matches the element that declares it, so a one-element
 * region is a wrapper) and the token remap recolours the fill.
 *
 * ```tsx
 * <Progress value={72}>Uploading photos</Progress>
 * <Progress>Preparing your export</Progress>   // indeterminate
 * ```
 *
 * `className` and `style` go to the root; `ref` and every other attribute
 * go to the `<progress>` element.
 */
export function Progress({
  value,
  size = "md",
  striped,
  animated,
  labels,
  className,
  style,
  children,
  ref,
  ...rest
}: ProgressProps) {
  const labelId = `${useId()}-progress`;
  const pct = value == null ? undefined : clamp(value);
  const valueLabel =
    labels?.value ??
    ((n: number) => new Intl.NumberFormat(undefined, { style: "percent" }).format(n / 100));
  const named = children != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;

  // Said once per change, after commit, like the other naming checks.
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || named) return;
    console.error(
      "LoamUI: <Progress> has no accessible name. Name what is progressing: pass the label as children, or aria-label / aria-labelledby.",
    );
  }, [named]);

  return (
    <div
      className={cx("loam-Progress", className)}
      data-size={size}
      data-striped={striped || animated || undefined}
      data-animated={animated || undefined}
      style={style}
    >
      {children != null && (
        <span id={labelId} className="label">
          {children}
        </span>
      )}
      <progress
        ref={ref}
        value={pct}
        max={100}
        aria-labelledby={children != null ? labelId : undefined}
        aria-valuetext={labels?.value && pct != null ? valueLabel(pct) : undefined}
        {...rest}
      >
        {pct != null && valueLabel(pct)}
      </progress>
    </div>
  );
}
