"use client";

import { Children } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface AvatarGroupProps extends PartProps<"ul"> {}

/** An overlapping list. Compose an additional Avatar for an overflow count. */
export function AvatarGroup({ className, children, ref, ...rest }: AvatarGroupProps) {
  return (
    <ul ref={ref} role="list" className={cx("loam-Avatar-group", className)} {...rest}>
      {Children.map(children, (child) => (child == null ? null : <li>{child}</li>))}
    </ul>
  );
}
