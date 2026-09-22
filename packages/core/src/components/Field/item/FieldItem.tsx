"use client";

import { use } from "react";
import type { PartProps } from "../../../utils/props.js";
import { FieldContext } from "../root/FieldRootContext.js";
import { FieldRoot } from "../root/FieldRoot.js";

export interface FieldItemProps extends PartProps<"div"> {}

export function FieldItem(props: FieldItemProps) {
  const parent = use(FieldContext);
  return <FieldRoot invalid={parent?.invalid} labels={parent?.labels} {...props} />;
}
