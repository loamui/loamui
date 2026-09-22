"use client";

import { use, useId } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";
import { idList } from "../../utils/render.js";
import { useFieldControlProps } from "../Field/root/FieldRootContext.js";
import { RadioGroupContext } from "./group-context.js";

export interface RadioProps extends Omit<PartProps<"input">, "size" | "type"> {
  label?: ReactNode;
  /** Helper text rendered under the label. */
  description?: ReactNode;
  /**
   * Props for the labelled row (`label.loam-Radio-wrapper`), which exists
   * only with a `label` or `description`. `className`, `style`, `ref` and
   * every other prop land on the `<input>` itself.
   */
  wrapperProps?: Omit<PartProps<"label">, "children" | "htmlFor">;
}

/** The bare radio input, minus any label. */
export type RadioControlProps = Omit<RadioProps, "label" | "description" | "wrapperProps">;

/**
 * A plain `<input type="radio">` — the elements layer paints it with
 * `accent-color`, so there is no custom dot. When rendered inside a `Field`
 * it reads its id / describedby from context.
 */
function RadioControl({
  id,
  className,
  "aria-describedby": ariaDescribedby,
  ref,
  ...rest
}: RadioControlProps) {
  const field = useFieldControlProps(ariaDescribedby, id);
  const group = use(RadioGroupContext);
  // No aria-invalid here: ARIA allows it on the radiogroup, not the
  // individual radio, so the group's fieldset carries composed errors.
  const resolvedId = id ?? field.id;
  const describedBy = field["aria-describedby"];

  // Group participation via context (no cloneElement): shared name and
  // selection state, unless the Radio's own props say otherwise.
  const optionValue = typeof rest.value === "string" ? rest.value : undefined;
  const name = rest.name ?? group?.name;
  const selection =
    group && optionValue !== undefined && rest.checked === undefined
      ? group.value !== undefined
        ? { checked: optionValue === group.value }
        : rest.defaultChecked === undefined && group.defaultValue !== undefined
          ? { defaultChecked: optionValue === group.defaultValue }
          : {}
      : {};
  const onChange =
    group?.onSelect || rest.onChange
      ? (e: ChangeEvent<HTMLInputElement>) => {
          rest.onChange?.(e);
          group?.onSelect?.(e.currentTarget.value);
        }
      : undefined;

  return (
    <input
      ref={ref}
      id={resolvedId}
      type="radio"
      className={cx("loam-Radio", className)}
      {...rest}
      aria-describedby={describedBy}
      name={name}
      onChange={onChange}
      {...selection}
    />
  );
}

/**
 * A single choice within a set of mutually exclusive options.
 *
 * Pass `label`/`description` for the usual labelled row, or nothing for
 * the bare input (it self-wires inside a `Field`). Usually lives inside a
 * {@link RadioGroup}.
 */
export function Radio({
  label,
  description,
  id,
  wrapperProps,
  "aria-describedby": ariaDescribedby,
  ref,
  ...control
}: RadioProps) {
  const autoId = useId();
  const field = useFieldControlProps();

  if (!label && !description) {
    return <RadioControl ref={ref} id={id} aria-describedby={ariaDescribedby} {...control} />;
  }

  const inputId = id ?? field.id ?? autoId;
  const descId = description ? `${inputId}-desc` : undefined;
  const { className: wrapperClassName, ...wrapper } = wrapperProps ?? {};

  return (
    <label className={cx("loam-Radio-wrapper", wrapperClassName)} {...wrapper} htmlFor={inputId}>
      <RadioControl
        ref={ref}
        id={inputId}
        aria-describedby={idList(descId, ariaDescribedby)}
        {...control}
      />
      <span className="body">
        {label && <span className="label">{label}</span>}
        {description && (
          <span className="description" id={descId}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
