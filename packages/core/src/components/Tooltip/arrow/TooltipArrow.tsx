"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useTooltipContext } from "../root/TooltipRootContext.js";

export interface TooltipArrowProps extends PartProps<"span"> {}

export function TooltipArrow({ className, ...rest }: TooltipArrowProps) {
  useTooltipContext("Tooltip.Arrow");
  return <span aria-hidden="true" className={cx("arrow", className)} {...rest} />;
}
