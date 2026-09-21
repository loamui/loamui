"use client";

import { use, useCallback, useMemo } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { useFieldControlProps } from "../../Field/root/FieldRootContext.js";
import { useFormReset } from "../../../hooks/use-form-reset.js";
import { useUserInvalid } from "../../../hooks/use-user-invalid.js";
import { FileInputContext } from "../root/FileInputRootContext.js";

export interface FileInputControlProps extends Omit<
  PartProps<"input">,
  "size" | "type" | "value" | "defaultValue"
> {}

/**
 * The native `<input type="file">`. Inside a `Field` it reads its id,
 * description and error wiring from context, like `Input`; inside a
 * `FileInput.Root` it reports its selection to the Files list and is
 * visually hidden, the Prompt being its label and its box. On its own it
 * is the plain native control, in view.
 */
export function FileInputControl({
  id,
  className,
  disabled,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  onChange,
  onInput,
  onInvalid,
  ref,
  ...rest
}: FileInputControlProps) {
  const field = useFieldControlProps(ariaDescribedby, id);
  const ctx = use(FileInputContext);
  const setFiles = ctx?.setFiles;
  const { nativeInvalid, validationRef, checkOnInput, checkOnInvalid } =
    useUserInvalid<HTMLInputElement>();
  // A form reset empties the control natively; the list follows it.
  const clearFiles = useCallback(() => setFiles?.([]), [setFiles]);
  const resetRef = useFormReset<HTMLInputElement>(clearFiles);
  // The Root's ref goes on last: a drop hands the files straight to this input.
  const inputRef = useMemo(
    () => composeRefs(composeRefs(composeRefs(ref, resetRef), validationRef), ctx?.controlRef),
    [ref, resetRef, validationRef, ctx?.controlRef],
  );

  return (
    <input
      ref={inputRef}
      id={field.id ?? id ?? ctx?.id}
      type="file"
      className={cx(ctx ? "loam-VisuallyHidden" : undefined, className)}
      disabled={disabled}
      {...rest}
      aria-invalid={ariaInvalid ?? field["aria-invalid"] ?? (nativeInvalid || undefined)}
      aria-describedby={field["aria-describedby"]}
      onChange={(e) => {
        onChange?.(e);
        setFiles?.(Array.from(e.currentTarget.files ?? []));
      }}
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
