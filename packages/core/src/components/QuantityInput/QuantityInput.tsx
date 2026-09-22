"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "../Button/Button.js";
import { useFieldControlProps } from "../Field/root/FieldRootContext.js";
import { useFormReset } from "../../hooks/use-form-reset.js";
import { useUserInvalid } from "../../hooks/use-user-invalid.js";
import { composeRefs } from "../../utils/render.js";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";

/** The words the buttons say, each with an English default. */
export interface QuantityInputLabels {
  /** Accessible name of the decrement button. @default "Fewer" */
  decrement?: string;
  /** Accessible name of the increment button. @default "More" */
  increment?: string;
}

const DEFAULT_LABELS: Required<QuantityInputLabels> = {
  decrement: "Fewer",
  increment: "More",
};

export interface QuantityInputProps extends Omit<
  PartProps<"input">,
  "size" | "type" | "children" | "min" | "max" | "step"
> {
  /** The smallest count allowed; the decrement button disables here. @default 0 */
  min?: number;
  /** The largest count allowed; the increment button disables here. */
  max?: number;
  /** How much one press changes the count. @default 1 */
  step?: number;
  /** The buttons' names, for another language or the page's own words. */
  labels?: QuantityInputLabels;
  /**
   * Props for the row that holds the buttons (`div.loam-QuantityInput`).
   * `className`, `style`, `ref` and every other prop land on the `<input>`
   * itself.
   */
  wrapperProps?: Omit<PartProps<"div">, "children">;
}

/** Which bounds a value sits on. An empty or unparsable value sits on neither. */
function edges(value: unknown, min: number, max: number | undefined) {
  const n = typeof value === "number" ? value : value == null || value === "" ? NaN : Number(value);
  return { atMin: n <= min, atMax: max !== undefined && n >= max };
}

function Glyph({ plus }: { plus?: boolean }): ReactNode {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {plus && <path d="M8 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}

/**
 * A count a person adjusts by one: items in a cart, guests, seats.
 *
 * A native `<input type="number">` is the value of record, flanked by two
 * {@link Button}s that step it. The buttons call the input's own
 * `stepDown()` / `stepUp()` and fire a native `input` event, so React's
 * `onChange`, a surrounding form and constraint validation all see one
 * value, in the input, with nothing mirrored here. They disable at `min`
 * and `max`; a typed value outside the bounds is left for the field to
 * report, as any Input would.
 *
 * Label it by composing {@link Field} — the control reads its id,
 * description and error wiring from the surrounding `Field.Root`. Outside
 * a Field give it an `aria-label` or `aria-labelledby`; in development a
 * count with no name is reported to the console.
 *
 * ```tsx
 * <Field.Root>
 *   <Field.Label>Quantity</Field.Label>
 *   <QuantityInput name="quantity" defaultValue={1} min={1} max={10} />
 * </Field.Root>
 * ```
 */
export function QuantityInput({
  min = 0,
  max,
  step = 1,
  labels,
  wrapperProps,
  value,
  defaultValue,
  disabled,
  readOnly,
  className,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  onInput,
  onInvalid,
  ref,
  ...rest
}: QuantityInputProps) {
  const field = useFieldControlProps(ariaDescribedby, id);
  const { nativeInvalid, validationRef, checkOnInput, checkOnInvalid } =
    useUserInvalid<HTMLInputElement>();
  const ownRef = useRef<HTMLInputElement>(null);
  const decrementLabel = labels?.decrement ?? DEFAULT_LABELS.decrement;
  const incrementLabel = labels?.increment ?? DEFAULT_LABELS.increment;
  const { className: wrapperClassName, ...wrapper } = wrapperProps ?? {};

  // The value lives only in the input. The one thing a render needs to know
  // is whether it sits on a bound, so the buttons can disable — read from
  // the value prop when controlled, otherwise noted from the input's own
  // events. A form reset restores the default value without an input event,
  // so it is observed too.
  const [uncontrolledEdges, setUncontrolledEdges] = useState(() => edges(defaultValue, min, max));
  const controlled = value !== undefined;
  const { atMin, atMax } = controlled ? edges(value, min, max) : uncontrolledEdges;

  const onReset = useCallback(
    (input: HTMLInputElement) => {
      if (!controlled) setUncontrolledEdges(edges(input.defaultValue, min, max));
    },
    [controlled, min, max],
  );
  const resetRef = useFormReset<HTMLInputElement>(onReset);
  const inputRef = useMemo(
    () => composeRefs(composeRefs(composeRefs(ref, validationRef), resetRef), ownRef),
    [ref, validationRef, resetRef],
  );

  // A count with no name is a count a screen reader cannot ask about. The
  // input's own `labels` sees a Field.Label and any other <label for>.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const input = ownRef.current;
    if (!input) return;
    if (
      input.labels?.length ||
      input.hasAttribute("aria-label") ||
      input.hasAttribute("aria-labelledby")
    ) {
      return;
    }
    console.error(
      "LoamUI: QuantityInput has no accessible name. Render it inside a Field with a Field.Label, or give it aria-label or aria-labelledby.",
    );
  }, []);

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    onInput?.(e);
    checkOnInput(e);
    if (!controlled) setUncontrolledEdges(edges(e.currentTarget.value, min, max));
  };

  const stepBy = (direction: -1 | 1) => {
    const input = ownRef.current;
    if (!input || input.disabled || input.readOnly) return;
    if (direction < 0) input.stepDown();
    else input.stepUp();
    // stepUp/stepDown change the value silently. The browser fires input and
    // change for its own spinner, so do the same: React's onChange, native
    // listeners and the form all hear one change.
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  return (
    <div className={cx("loam-QuantityInput", wrapperClassName)} {...wrapper}>
      <Button
        type="button"
        aria-label={decrementLabel}
        disabled={disabled || readOnly || atMin}
        onClick={() => stepBy(-1)}
      >
        <Glyph />
      </Button>
      <input
        ref={inputRef}
        type="number"
        inputMode="numeric"
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        id={field.id ?? id}
        min={min}
        max={max}
        step={step}
        value={value}
        defaultValue={defaultValue}
        {...rest}
        aria-invalid={ariaInvalid ?? field["aria-invalid"] ?? (nativeInvalid || undefined)}
        aria-describedby={field["aria-describedby"]}
        onInput={handleInput}
        onInvalid={(e) => {
          onInvalid?.(e);
          checkOnInvalid(e);
        }}
      />
      <Button
        type="button"
        aria-label={incrementLabel}
        disabled={disabled || readOnly || atMax}
        onClick={() => stepBy(1)}
      >
        <Glyph plus />
      </Button>
    </div>
  );
}
