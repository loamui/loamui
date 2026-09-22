"use client";

import { FieldsetLegend } from "../../Fieldset/legend/FieldsetLegend.js";
import type { FieldsetLegendProps } from "../../Fieldset/legend/FieldsetLegend.js";
import { useRadioGroupParts } from "../root/RadioGroupRootContext.js";

export interface RadioGroupLegendProps extends FieldsetLegendProps {}

/** The group's name: core `Fieldset.Legend`, which reads `labels.optional`. */
export function RadioGroupLegend(props: RadioGroupLegendProps) {
  useRadioGroupParts("RadioGroup.Legend");
  return <FieldsetLegend {...props} />;
}
