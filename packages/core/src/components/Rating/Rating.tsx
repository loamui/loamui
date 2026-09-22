"use client";

import { useId } from "react";
import type { ChangeEvent, Ref } from "react";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";
import { FieldsetRoot } from "../Fieldset/root/FieldsetRoot.js";
import { FieldsetLegend } from "../Fieldset/legend/FieldsetLegend.js";

/** The words the stars speak. */
export interface RatingLabels {
  /** Names each input. @default `"${n} stars"` */
  star?: (n: number) => string;
  /** Names the picture in display mode. @default `"${value} out of ${max}"` */
  value?: (value: number, max: number) => string;
}

export interface RatingProps extends Omit<PartProps<"fieldset">, "defaultValue" | "onChange"> {
  /**
   * What is being rated ("Rate this recipe", "Average rating"). Names the
   * group of stars for assistive tech; visually hidden unless `showLabel`.
   */
  label: string;
  /** Show the label as text beside the stars instead of hiding it visually. */
  showLabel?: boolean;
  /** How many stars. @default 5 */
  max?: number;
  /**
   * Shared `name` for the star radios, so a form submits the rating as one
   * field. Auto-generated when omitted.
   */
  name?: string;
  /**
   * The rating. In input mode this is the controlled value (pair with
   * `onValueChange`); in display mode it is the rating shown, halves allowed.
   */
  value?: number;
  /** Initial rating for uncontrolled input usage. */
  defaultValue?: number;
  /**
   * The words the stars speak, for another language or a different noun:
   * `star(n)` names each input ("3 stars"), `value(v, max)` names the
   * picture in display mode ("3.5 out of 5").
   */
  labels?: RatingLabels;
  /** Fires with the number of stars chosen. */
  onValueChange?: (value: number) => void;
  /**
   * Display mode: the stars are a picture of `value` rather than inputs.
   * No radios, no fieldset — just the glyphs and their accessible name.
   */
  readOnly?: boolean;
  /** The user must choose a star before the form submits. */
  required?: boolean;
  /** Disables every star (via the fieldset, so the whole group greys out). */
  disabled?: boolean;
}

// One glyph, one path, painted with currentColor. Drawn twice: an outline
// underneath (the empty star) and a fill on top that the CSS clips to the
// star's amount, so a half star is the same markup as a whole one.
const STAR =
  "M12 2.5L14.41 9.18L21.51 9.41L15.9 13.77L17.88 20.59L12 16.6L6.12 20.59L8.1 13.77L2.49 9.41L9.59 9.18Z";

function Star() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path className="outline" d={STAR} />
      <path className="fill" d={STAR} />
    </svg>
  );
}

/**
 * Stars that are real inputs.
 *
 * By default a `<fieldset>` of native radios, one per star, each hidden
 * under its glyph: the radio group supplies exclusivity, arrow-key
 * movement and form submission, and each star announces as "3 stars".
 * With `readOnly` the same stars become a picture of a rating: no radios,
 * the glyphs marked decorative, and one accessible name ("3.5 out of 5")
 * on the group.
 *
 * Filled stars take the accent colour, so a `--loam-context` region
 * recolours them; there is no colour or size prop, and the glyph follows
 * the surrounding type.
 *
 * ```tsx
 * <Rating label="Rate this recipe" onValueChange={setStars} />
 * <Rating readOnly label="Average rating" value={4.5} />
 * ```
 */
export function Rating({
  labels,
  label,
  showLabel,
  max = 5,
  name,
  value,
  defaultValue,
  onValueChange,
  readOnly,
  required,
  disabled,
  className,
  ref,
  ...rest
}: RatingProps) {
  const starLabel = labels?.star ?? ((n: number) => `${n} ${n === 1 ? "star" : "stars"}`);
  const valueLabel = labels?.value ?? ((v: number, m: number) => `${v} out of ${m}`);
  const autoId = useId();
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (readOnly) {
    // The picture rounds to the nearest half star; the name keeps the
    // exact value, since that is the fact the stars illustrate.
    const shown = Math.min(max, Math.max(0, value ?? 0));
    const halves = Math.round(shown * 2);
    return (
      <span
        ref={ref as Ref<HTMLSpanElement>}
        className={cx("loam-Rating", className)}
        data-read-only=""
        data-show-label={showLabel || undefined}
        {...rest}
      >
        {/* The label always names the stars; unshown, it is only hidden. */}
        {showLabel ? (
          <span className="label">{label}</span>
        ) : (
          <span className="loam-VisuallyHidden">{label}</span>
        )}
        <span className="stars" role="img" aria-label={valueLabel(shown, max)}>
          {stars.map((star) => {
            const amount = halves - (star - 1) * 2;
            const fill = amount >= 2 ? "full" : amount === 1 ? "half" : "empty";
            return (
              <span key={star} className="star" data-fill={fill}>
                <Star />
              </span>
            );
          })}
        </span>
      </span>
    );
  }

  const groupName = name ?? autoId;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(Number(event.currentTarget.value));
  };

  return (
    <FieldsetRoot
      ref={ref}
      className={cx("loam-Rating", className)}
      data-show-label={showLabel || undefined}
      disabled={disabled}
      {...rest}
    >
      <FieldsetLegend className={showLabel ? undefined : "loam-VisuallyHidden"}>
        {label}
      </FieldsetLegend>
      <span className="stars">
        {stars.map((star) => (
          <label key={star} className="star">
            <input
              type="radio"
              name={groupName}
              value={star}
              required={required}
              onChange={handleChange}
              {...(value !== undefined
                ? { checked: value === star }
                : defaultValue !== undefined
                  ? { defaultChecked: defaultValue === star }
                  : {})}
            />
            <Star />
            <span className="loam-VisuallyHidden">{starLabel(star)}</span>
          </label>
        ))}
      </span>
    </FieldsetRoot>
  );
}
