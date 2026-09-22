"use client";

import type { PartProps } from "../../../utils/props.js";

export interface MenuSeparatorProps extends PartProps<"hr"> {}

export function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  // A real <hr>: the platform's separator role, no ARIA needed.
  return <hr className={className} {...rest} />;
}
