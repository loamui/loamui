"use client";

import { useMemo } from "react";
import { useFieldControlProps } from "../../Field/root/FieldRootContext.js";
import { useUserInvalid } from "../../../hooks/use-user-invalid.js";
import { composeRefs } from "../../../utils/render.js";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface SelectProps extends Omit<PartProps<"select">, "size"> {
  /**
   * Props for the box around the select (`div.loam-Select-field`), which
   * positions the chevron. `className`, `style`, `ref` and every other prop
   * of the component land on the `<select>` itself; this is the one way to
   * reach the box.
   */
  wrapperProps?: Omit<PartProps<"div">, "children">;
}

/**
 * A native `<select>` with a fluid chevron. Options are children
 * (`<option>` / `<optgroup>`), exactly as the platform defines them, and
 * so is an unanswered start: make the first child
 * `<option value="" disabled>Pick a country</option>` and the select
 * starts on it, so `required` catches a field the user skipped. Label it
 * by composing {@link Field}; the control reads its wiring from the
 * surrounding `Field.Root`.
 */
export function SelectRoot({
  wrapperProps,
  className,
  children,
  defaultValue,
  value,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  onInput,
  onInvalid,
  ref,
  ...rest
}: SelectProps) {
  const field = useFieldControlProps(ariaDescribedby, id);
  const { nativeInvalid, validationRef, checkOnInput, checkOnInvalid } =
    useUserInvalid<HTMLSelectElement>();
  const selectRef = useMemo(() => composeRefs(ref, validationRef), [ref, validationRef]);
  const { className: wrapperClassName, ...wrapper } = wrapperProps ?? {};
  // An uncontrolled select with nothing chosen starts on its empty-valued
  // option when it has one (the prompt), else on the first enabled option,
  // which is what the platform does with no value at all.
  const resolvedDefault = value === undefined && defaultValue === undefined ? "" : defaultValue;

  return (
    <div className={cx("loam-Select-field", wrapperClassName)} {...wrapper}>
      <select
        ref={selectRef}
        className={className}
        value={value}
        defaultValue={resolvedDefault}
        id={field.id ?? id}
        {...rest}
        aria-invalid={ariaInvalid ?? field["aria-invalid"] ?? (nativeInvalid || undefined)}
        aria-describedby={field["aria-describedby"]}
        onInput={(e) => {
          onInput?.(e);
          checkOnInput(e);
        }}
        onInvalid={(e) => {
          onInvalid?.(e);
          checkOnInvalid(e);
        }}
      >
        {children}
      </select>
      <svg className="chevron" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
