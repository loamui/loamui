"use client";

import { use, useEffect, useId, useMemo, useRef } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { useFieldControlProps } from "../../Field/root/FieldRootContext.js";
import { RangeContext, toNumber } from "../root/RangeRootContext.js";

/** A point on the track: a value the thumb snaps to, with an optional label. */
export interface RangeMark {
  value: number;
  label?: string;
}

export interface RangeProps extends Omit<PartProps<"input">, "size" | "type"> {
  /**
   * Points on the track. They are forwarded to a `<datalist>` the input
   * references, so the platform snaps the thumb to them, and drawn as ticks
   * under the track with each label beneath its tick.
   */
  marks?: RangeMark[];
}

/**
 * A styled `<input type="range">` for choosing a value from a range.
 *
 * Label it by composing {@link Field}; the control reads its id,
 * description and error wiring from the surrounding `Field.Root`. No
 * state is held here: uncontrolled via `defaultValue`, or controlled
 * with `value` + `onChange`. Inside a `Range.Root` it reports its value,
 * so a `Range.Output` beside it can show it.
 */
export function RangeControl({
  min = 0,
  max = 100,
  step = 1,
  marks,
  id,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  onChange,
  ref: refProp,
  ...rest
}: RangeProps) {
  const field = useFieldControlProps(ariaDescribedby, id);
  const root = use(RangeContext);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, inputRef), [refProp]);
  const inputId = field.id ?? id ?? root?.inputId;
  const report = root?.report;
  const minValue = toNumber(min, 0);
  const maxValue = toNumber(max, 100);

  // The value is the input's own (defaultValue or value), so it is read from
  // the input rather than reconstructed from props. This fires when the value
  // arrives from outside — on mount, and when a controlled value or the bounds
  // change. What the user does goes through onChange below, because an event
  // is where an event belongs; reporting on every render instead would set
  // state in the Root after each one, and re-render both.
  const controlledValue = rest.value;
  useEffect(() => {
    const input = inputRef.current;
    if (!report || !input || !inputId) return;
    report({ id: inputId, value: input.valueAsNumber, min: minValue, max: maxValue });
  }, [report, inputId, minValue, maxValue, controlledValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (report && inputId) {
      report({ id: inputId, value: e.currentTarget.valueAsNumber, min: minValue, max: maxValue });
    }
  };

  const input = (
    <input
      ref={composedRef}
      id={inputId}
      type="range"
      className={cx("loam-Range", className)}
      min={min}
      max={max}
      step={step}
      list={marks ? listId : undefined}
      // No native-validation state is needed here: every range thumb position
      // is valid, so only a composed Field error can mark it invalid.
      aria-invalid={ariaInvalid ?? field["aria-invalid"]}
      aria-describedby={field["aria-describedby"]}
      onChange={handleChange}
      {...rest}
    />
  );

  if (!marks) return input;

  const span = maxValue - minValue || 1;
  return (
    <>
      {input}
      <datalist id={listId}>
        {marks.map((mark) => (
          <option key={mark.value} value={mark.value}>
            {mark.label ?? mark.value}
          </option>
        ))}
      </datalist>
      {/* The visible ticks and labels: a picture of the datalist, which
          stays the semantic copy, so they are hidden from assistive
          technology rather than exposed as a listbox after the slider. */}
      <div className="loam-Range-marks" aria-hidden="true">
        {marks.map((mark) => (
          <span
            key={mark.value}
            style={{ "--_at": (mark.value - minValue) / span } as CSSProperties}
          >
            {mark.label}
          </span>
        ))}
      </div>
    </>
  );
}
