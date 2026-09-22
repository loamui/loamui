"use client";

import type { ReactNode } from "react";
import { FieldRoot } from "../../Field/root/FieldRoot.js";
import { FieldLabel } from "../../Field/label/FieldLabel.js";
import { Input } from "../../Input/Input.js";
import type { InputProps } from "../../Input/Input.js";
import { PART_LABELS, useDateInputContext } from "../root/DateInputRootContext.js";
import type { DateInputPart } from "../root/DateInputRootContext.js";

export interface DateInputPartProps extends Omit<InputProps, "children"> {
  /** The visible field label. @default "Day" / "Month" / "Year" */
  children?: ReactNode;
}

// What each part asks for: day and year are numbers; the month accepts
// names ("jan", "january") as well as digits, so it keeps the full
// keyboard and a character more room. The size attribute is the width.
const PARTS: Record<DateInputPart, Pick<InputProps, "inputMode" | "size">> = {
  day: { inputMode: "numeric", size: 2 },
  month: { size: 3 },
  year: { inputMode: "numeric", size: 4 },
};

export function createPart(part: DateInputPart, displayName: string) {
  function DateInputPartField({ children, id, ...rest }: DateInputPartProps) {
    const ctx = useDateInputContext(displayName);
    const inputId = id ?? `${ctx.baseId}-${part}`;
    const invalid = typeof ctx.invalid === "boolean" ? ctx.invalid : ctx.invalid.includes(part);
    return (
      <FieldRoot id={inputId} invalid={invalid}>
        <FieldLabel>{children ?? PART_LABELS[part]}</FieldLabel>
        <Input
          {...PARTS[part]}
          name={ctx.name ? `${ctx.name}-${part}` : undefined}
          autoComplete={ctx.autoComplete === "bday" ? `bday-${part}` : undefined}
          aria-invalid={invalid || undefined}
          {...rest}
        />
      </FieldRoot>
    );
  }
  DateInputPartField.displayName = displayName;
  return DateInputPartField;
}
