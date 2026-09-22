"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";
import { composeRefs, idList } from "../../utils/render.js";
import { useFieldControlProps } from "../Field/root/FieldRootContext.js";
import { useUserInvalid } from "../../hooks/use-user-invalid.js";

export interface CheckboxProps extends Omit<PartProps<"input">, "size" | "type"> {
  label?: ReactNode;
  /** Helper text rendered below the label. */
  description?: ReactNode;
  /** Render the "partially checked" (dash) state. */
  indeterminate?: boolean;
  /**
   * Props for the labelled row's root (`div.loam-Checkbox-wrapper`), which
   * exists only with a `label` or `description`. `className`, `style`,
   * `ref` and every other prop land on the `<input>` itself.
   */
  wrapperProps?: Omit<PartProps<"div">, "children">;
}

/** The bare control, minus any label. */
export type CheckboxControlProps = Omit<CheckboxProps, "label" | "description" | "wrapperProps">;

/**
 * A plain `<input type="checkbox">` — the elements layer paints it with the
 * platform's own `accent-color`, so there is no custom box or SVG. When
 * rendered inside a `Field` it reads its id / describedby / aria-invalid
 * from context; otherwise it uses its own props.
 */
function CheckboxControl({
  indeterminate = false,
  id,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  onInput,
  onInvalid,
  ref,
  ...rest
}: CheckboxControlProps) {
  const field = useFieldControlProps(ariaDescribedby);
  const innerRef = useRef<HTMLInputElement>(null);
  const { nativeInvalid, validationRef, checkOnInput, checkOnInvalid } =
    useUserInvalid<HTMLInputElement>();
  const inputRef = useMemo(
    () => composeRefs(composeRefs(ref, innerRef), validationRef),
    [ref, validationRef],
  );

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const resolvedAriaInvalid = ariaInvalid ?? field["aria-invalid"] ?? (nativeInvalid || undefined);
  const resolvedId = id ?? field.id;
  const describedBy = field["aria-describedby"];

  return (
    <input
      ref={inputRef}
      id={resolvedId}
      type="checkbox"
      className={cx("loam-Checkbox", className)}
      {...rest}
      aria-invalid={resolvedAriaInvalid}
      aria-describedby={describedBy}
      onInput={(e) => {
        onInput?.(e);
        checkOnInput(e);
      }}
      onInvalid={(e) => {
        onInvalid?.(e);
        checkOnInvalid(e);
      }}
    />
  );
}

/**
 * A native `<input type="checkbox">`.
 *
 * The `label`/`description` props render an accessible inline row; errors
 * compose via `Field.Error`. Without them you get only the control, which
 * self-wires when placed inside a `Field`. The labelled row reads the
 * Field too: its input takes the Field's id, so a `Field.Label` in the
 * same Field points at it, and the Field's description and error join its
 * own description in `aria-describedby`.
 */
export function Checkbox({
  label,
  description,
  id,
  wrapperProps,
  "aria-describedby": ariaDescribedby,
  ref,
  ...control
}: CheckboxProps) {
  const autoId = useId();
  const field = useFieldControlProps();

  if (!label && !description) {
    return <CheckboxControl ref={ref} id={id} aria-describedby={ariaDescribedby} {...control} />;
  }

  const fieldId = id ?? field.id ?? autoId;
  const descId = description ? `${fieldId}-desc` : undefined;
  const { className: wrapperClassName, ...wrapper } = wrapperProps ?? {};

  return (
    <div className={cx("loam-Checkbox-wrapper", wrapperClassName)} {...wrapper}>
      <label htmlFor={fieldId}>
        <CheckboxControl
          ref={ref}
          id={fieldId}
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
    </div>
  );
}
