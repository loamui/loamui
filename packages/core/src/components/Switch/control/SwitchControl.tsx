"use client";

import { useMemo } from "react";
import type { PartProps } from "../../../utils/props.js";
import { useFieldControlProps } from "../../Field/root/FieldRootContext.js";
import { useUserInvalid } from "../../../hooks/use-user-invalid.js";
import { composeRefs } from "../../../utils/render.js";

export interface SwitchControlProps extends Omit<PartProps<"input">, "size" | "type"> {}
/**
 * The native `<input role="switch">`, composed beside Track inside Root. When rendered
 * inside a `Field` it reads its id / describedby / invalid from context
 * (`<Field.Label><Switch.Control /> …</Field.Label>`); otherwise it uses
 * its own props.
 */
export function SwitchControl({
  id,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  onInput,
  onInvalid,
  ref,
  ...rest
}: SwitchControlProps) {
  const field = useFieldControlProps(ariaDescribedby, id);

  const { nativeInvalid, validationRef, checkOnInput, checkOnInvalid } =
    useUserInvalid<HTMLInputElement>();
  const inputRef = useMemo(() => composeRefs(ref, validationRef), [ref, validationRef]);
  const resolvedAriaInvalid = ariaInvalid ?? field["aria-invalid"] ?? (nativeInvalid || undefined);

  return (
    <>
      {/* role-has-required-aria-props is off for this file (.oxlintrc):
          the native checkbox's checkedness maps to aria-checked */}
      <input
        ref={inputRef}
        id={field.id ?? id}
        type="checkbox"
        role="switch"
        className={className}
        {...rest}
        aria-invalid={resolvedAriaInvalid}
        aria-describedby={field["aria-describedby"]}
        onInput={(e) => {
          onInput?.(e);
          checkOnInput(e);
        }}
        onInvalid={(e) => {
          onInvalid?.(e);
          checkOnInvalid(e);
        }}
      />
    </>
  );
}
