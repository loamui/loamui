"use client";

import { useCallback, useId, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs, idList } from "../../../utils/render.js";
import { useFormReset } from "../../../hooks/use-form-reset.js";
import { useIdRegistry } from "../../../hooks/use-id-registry.js";
import { FieldsetRoot } from "../../Fieldset/root/FieldsetRoot.js";
import { RadioGroupContext } from "../group-context.js";
import type { RadioGroupContextValue } from "../group-context.js";
import { DEFAULT_ERROR_PREFIX, RadioGroupPartsContext } from "./RadioGroupRootContext.js";
import type { RadioGroupLabels, RadioGroupPartsContextValue } from "./RadioGroupRootContext.js";

export interface RadioGroupRootProps extends Omit<
  PartProps<"fieldset">,
  "onChange" | "defaultValue"
> {
  /**
   * Shared `name` for every radio in the group (guarantees native
   * mutual-exclusivity). Auto-generated when omitted.
   */
  name?: string;
  value?: string;
  defaultValue?: string;
  /** Fires with the newly selected value when a radio is chosen. */
  onChange?: (value: string) => void;
  /** Explicit validation state, independent of message content. */
  invalid?: boolean;
  /** Layout direction of the options. @default "vertical" */
  orientation?: "vertical" | "horizontal";
  /** The group's own words; the Legend and Error read them from here. */
  labels?: RadioGroupLabels;
}

export function RadioGroupRoot({
  name,
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
  invalid: invalidProp = false,
  labels,
  id,
  className,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  onInvalid,
  onInput,
  children,
  ref,
  ...rest
}: RadioGroupRootProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const groupName = name ?? baseId;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const [descriptionIds, registerDescription] = useIdRegistry();
  const [errorIds, registerError] = useIdRegistry();
  const errorPrefix = labels?.errorPrefix ?? DEFAULT_ERROR_PREFIX;
  const [nativeInvalid, setNativeInvalid] = useState(false);
  const invalid = invalidProp || nativeInvalid;
  const clearNativeInvalid = useCallback(() => setNativeInvalid(false), []);
  const resetRef = useFormReset<HTMLFieldSetElement>(clearNativeInvalid);
  const rootRef = useMemo(() => composeRefs(ref, resetRef), [ref, resetRef]);

  const checkOnInput = (event: FormEvent<HTMLFieldSetElement>) => {
    if (!nativeInvalid) return;
    const radios = event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    setNativeInvalid(Array.from(radios).some((radio) => !radio.validity.valid));
  };

  const ctx = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      value,
      defaultValue,
      onSelect: onChange,
    }),
    [groupName, value, defaultValue, onChange],
  );
  const parts = useMemo<RadioGroupPartsContextValue>(
    () => ({ descriptionId, errorId, errorPrefix, registerDescription, registerError }),
    [descriptionId, errorId, errorPrefix, registerDescription, registerError],
  );

  return (
    <RadioGroupContext value={ctx}>
      <RadioGroupPartsContext value={parts}>
        <FieldsetRoot
          ref={rootRef}
          id={id}
          // radiogroup (not the fieldset's implicit group): the precise
          // role, and the one ARIA allows aria-invalid on.
          role="radiogroup"
          className={cx("loam-RadioGroup", className)}
          data-orientation={orientation}
          labels={labels}
          aria-describedby={idList(...descriptionIds, ...errorIds, ariaDescribedby)}
          aria-invalid={ariaInvalid ?? (invalid || undefined)}
          onInvalid={(event) => {
            onInvalid?.(event);
            setNativeInvalid(true);
          }}
          onInput={(event) => {
            onInput?.(event);
            checkOnInput(event);
          }}
          {...rest}
        >
          {children}
        </FieldsetRoot>
      </RadioGroupPartsContext>
    </RadioGroupContext>
  );
}
