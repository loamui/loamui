import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import type { LoamUISize, PartProps } from "../../utils/props.js";

export interface MeterProps extends Omit<
  PartProps<"meter">,
  "color" | "value" | "min" | "max" | "low" | "high" | "optimum"
> {
  /** The measured value. The browser clamps it into `min`–`max`. */
  value: number;
  /** Lower bound of the range. @default 0 */
  min?: number;
  /**
   * Upper bound of the range. The platform default is 1 (so `value` is a
   * fraction); most consumers pass `max={100}` and a percentage.
   * @default 1
   */
  max?: number;
  /** Upper bound of the low band. Values at or below it are "low". */
  low?: number;
  /** Lower bound of the high band. Values at or above it are "high". */
  high?: number;
  /**
   * The ideal value. Its band is the good one; the band next to it is
   * suboptimal and the far band is worst. Without it the middle band is
   * good and both ends are suboptimal.
   */
  optimum?: number;
  /** Accessible name. Required: the element has none of its own. */
  label: string;
  /** Track thickness. @default "md" */
  size?: LoamUISize;
  /**
   * Fallback text for browsers without `<meter>`.
   * @default the value as a percentage of the range
   */
  children?: ReactNode;
}

/** Where `value` sits in `min`–`max`, as a whole percentage. */
function percent(value: number, min: number, max: number) {
  const span = max - min;
  if (span <= 0) return 0;
  const clamped = Math.min(max, Math.max(min, value));
  return Math.round(((clamped - min) / span) * 100);
}

/**
 * A measurement within a known range, on the native `<meter>` element:
 * storage used, password strength, a score.
 *
 * Not progress: a meter reports where a value sits, not how far a task
 * has got (that is `Progress`). Give it `low`, `high` and `optimum` and
 * the browser picks the band the value falls in; the CSS paints that band
 * success, warning or danger. With no bands the fill is the primary
 * token, re-answered by any --loam-context region: declare
 * `--loam-context` on a region (an ancestor — a style query never matches
 * the element that declares it, so a one-element region is a wrapper)
 * and the token remap recolours the fill.
 */
export function Meter({
  value,
  min = 0,
  max = 1,
  low,
  high,
  optimum,
  label,
  size = "md",
  className,
  style,
  children,
  ref,
  ...rest
}: MeterProps) {
  return (
    <meter
      ref={ref}
      className={cx("loam-Meter", className)}
      data-size={size}
      value={value}
      min={min}
      max={max}
      low={low}
      high={high}
      optimum={optimum}
      aria-label={label}
      style={style}
      {...rest}
    >
      {children ?? `${percent(value, min, max)}%`}
    </meter>
  );
}
