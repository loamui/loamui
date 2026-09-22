"use client";

import { useCallback, useId, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { useFieldControlProps } from "../../Field/root/FieldRootContext.js";
import { RangeContext, RangeContextValue, RangeState } from "../root/RangeRootContext.js";

export interface RangeRootProps extends PartProps<"div"> {}

/**
 * The optional wrapper that carries the value between a `Range` and the
 * `Range.Output` that shows it. It sets `--_value` (the thumb's position as
 * a fraction) so the output can sit above the thumb. Not needed for a
 * range without an output.
 */
export function RangeRoot({ className, style, children, ...rest }: RangeRootProps) {
  const field = useFieldControlProps();
  const autoId = useId();
  const [state, setState] = useState<RangeState | null>(null);

  const report = useCallback((next: RangeState) => {
    setState((current) =>
      current &&
      current.id === next.id &&
      current.value === next.value &&
      current.min === next.min &&
      current.max === next.max
        ? current
        : next,
    );
  }, []);

  const inputId = field.id ?? state?.id ?? autoId;
  const value = useMemo<RangeContextValue>(
    () => ({ inputId, state, report }),
    [inputId, state, report],
  );

  const fraction =
    state && state.max > state.min && !Number.isNaN(state.value)
      ? Math.min(Math.max((state.value - state.min) / (state.max - state.min), 0), 1)
      : 0;

  return (
    <RangeContext value={value}>
      <div
        {...rest}
        className={cx("loam-Range-root", className)}
        style={{ "--_value": fraction, ...style } as CSSProperties}
      >
        {children}
      </div>
    </RangeContext>
  );
}
