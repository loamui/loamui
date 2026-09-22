"use client";

import { useId, useMemo } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { idList } from "../../../utils/render.js";
import { useIdRegistry } from "../../../hooks/use-id-registry.js";
import { FieldsetRoot } from "../../Fieldset/root/FieldsetRoot.js";
import { DEFAULT_ERROR_PREFIX, DateInputContext } from "./DateInputRootContext.js";
import type {
  DateInputContextValue,
  DateInputLabels,
  DateInputPart,
} from "./DateInputRootContext.js";

/**
 * Composable parts for asking for a memorable date.
 *
 * A date the user already knows — a date of birth, the date on a document —
 * is typed, not picked: a calendar widget makes them navigate to a value
 * they could have entered in three keystrokes. Day, Month and Year are
 * each a labelled Field around an Input inside a `<fieldset>` named by the
 * Legend, sized to their answer, raising a numeric keypad on touch
 * devices. Render only the parts you need — a month and year, say — and
 * the wiring adapts.
 *
 * For choosing a date from availability (bookings, appointments), a
 * calendar is the right tool — this component is not it.
 *
 * ```tsx
 * <DateInput.Root name="date-of-birth" autoComplete="bday">
 *   <DateInput.Legend>Date of birth</DateInput.Legend>
 *   <DateInput.Description>For example, 27 3 2007</DateInput.Description>
 *   <DateInput.Fields>
 *     <DateInput.Day />
 *     <DateInput.Month />
 *     <DateInput.Year />
 *   </DateInput.Fields>
 * </DateInput.Root>
 * ```
 */
export interface DateInputRootProps extends Omit<PartProps<"fieldset">, "name"> {
  /** Name prefix for form submission: `{name}-day`, `{name}-month`, `{name}-year`. */
  name?: string;
  /** Wire browser autofill when asking for a date of birth (WCAG 1.3.5). */
  autoComplete?: "bday";
  /** Validation state: true for all fields, or the specific invalid parts. */
  invalid?: boolean | DateInputPart[];
  /** The group's own words; the Legend and Error read them from here. */
  labels?: DateInputLabels;
}

export function DateInputRoot({
  name,
  autoComplete,
  invalid = false,
  "aria-describedby": ariaDescribedby,
  labels,
  id,
  className,
  children,
  ref,
  ...rest
}: DateInputRootProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const errorPrefix = labels?.errorPrefix ?? DEFAULT_ERROR_PREFIX;
  const [descriptionIds, registerDescription] = useIdRegistry();
  const [errorIds, registerError] = useIdRegistry();
  const describedBy = idList(...descriptionIds, ...errorIds, ariaDescribedby);

  const value = useMemo<DateInputContextValue>(
    () => ({
      baseId,
      name,
      autoComplete,
      descriptionId,
      errorId,
      errorPrefix,
      invalid,
      registerDescription,
      registerError,
    }),
    [
      baseId,
      name,
      autoComplete,
      descriptionId,
      errorId,
      errorPrefix,
      invalid,
      registerDescription,
      registerError,
    ],
  );

  return (
    <DateInputContext value={value}>
      <FieldsetRoot
        ref={ref}
        id={id}
        className={cx("loam-DateInput", className)}
        labels={labels}
        aria-describedby={describedBy}
        {...rest}
      >
        {children}
      </FieldsetRoot>
    </DateInputContext>
  );
}
