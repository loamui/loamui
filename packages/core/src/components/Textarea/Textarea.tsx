"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useFieldControlProps } from "../Field/root/FieldRootContext.js";
import { useUserInvalid } from "../../hooks/use-user-invalid.js";
import { composeRefs } from "../../utils/render.js";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";

export interface TextareaProps extends PartProps<"textarea"> {
  /**
   * Props for the bordered box around the textarea
   * (`div.loam-Textarea-field`). `className`, `style`, `ref` and every other
   * prop of the component land on the `<textarea>` itself; this is the one
   * way to reach the box.
   */
  wrapperProps?: Omit<PartProps<"div">, "children">;
  /**
   * Visible text rows: the field's height, and where the platform grows
   * the field with its content, the height it starts at. @default 3
   */
  rows?: number;
}

/**
 * The bordered multi-line field: a native `<textarea>` in the shared
 * control box. Label it by composing {@link Field}; the control reads its
 * wiring from the surrounding `Field.Root`.
 */
export function Textarea({
  rows = 3,
  wrapperProps,
  className,
  style,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  onInput,
  onInvalid,
  ref,
  ...rest
}: TextareaProps) {
  const field = useFieldControlProps(ariaDescribedby, id);
  const { nativeInvalid, validationRef, checkOnInput, checkOnInvalid } =
    useUserInvalid<HTMLTextAreaElement>();
  const textareaRef = useMemo(() => composeRefs(ref, validationRef), [ref, validationRef]);
  const { className: wrapperClassName, ...wrapper } = wrapperProps ?? {};
  return (
    <div className={cx("loam-Textarea-field", wrapperClassName)} {...wrapper}>
      <textarea
        ref={textareaRef}
        className={className}
        rows={rows}
        // field-sizing: content ignores the rows attribute, so the
        // stylesheet reads the same number back as a floor in lh.
        style={{ "--_rows": rows, ...style } as CSSProperties}
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
      />
    </div>
  );
}
