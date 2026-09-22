"use client";

import type { PartProps } from "../../../utils/props.js";
import { MenuGroupContext, useGroupLabel } from "./MenuGroupContext.js";

export interface MenuGroupProps extends PartProps<"div"> {}

export function MenuGroup({ className, children, ...rest }: MenuGroupProps) {
  const { value, labelledBy } = useGroupLabel();
  return (
    <MenuGroupContext value={value}>
      <div role="group" aria-labelledby={labelledBy} className={className} {...rest}>
        {children}
      </div>
    </MenuGroupContext>
  );
}
