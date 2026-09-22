"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useEffect } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";
import { MenuGroupContext } from "../group/MenuGroupContext.js";

export interface MenuGroupLabelProps extends PartProps<"div"> {}

export function MenuGroupLabel({ className, children, ...rest }: MenuGroupLabelProps) {
  const group = useRequiredContext(
    MenuGroupContext,
    "Menu.GroupLabel",
    "Menu.Group> or <Menu.RadioGroup",
  );
  const { registerLabel } = group;
  useEffect(() => registerLabel(), [registerLabel]);
  return (
    <div id={group.labelId} className={cx("group-label", className)} {...rest}>
      {children}
    </div>
  );
}
