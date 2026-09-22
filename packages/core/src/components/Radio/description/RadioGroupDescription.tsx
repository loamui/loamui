"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useIsoLayoutEffect } from "../../../hooks/use-id-registry.js";
import { useRadioGroupParts } from "../root/RadioGroupRootContext.js";

export interface RadioGroupDescriptionProps extends PartProps<"p"> {}

/** Helper text under the legend, joined to the group with `aria-describedby`. */
export function RadioGroupDescription({
  id,
  className,
  children,
  ref,
  ...rest
}: RadioGroupDescriptionProps) {
  const { descriptionId: defaultId, registerDescription } =
    useRadioGroupParts("RadioGroup.Description");
  const descriptionId = id ?? defaultId;
  useIsoLayoutEffect(
    () => registerDescription(descriptionId),
    [descriptionId, registerDescription],
  );
  return (
    <p ref={ref} className={cx("description", className)} id={descriptionId} {...rest}>
      {children}
    </p>
  );
}
