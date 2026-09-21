"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useAvatarContext } from "../root/AvatarRootContext.js";

export interface AvatarFallbackProps extends PartProps<"span"> {}

/** Visible until the image loads, and after a load failure. */
export function AvatarFallback({ className, ref, ...rest }: AvatarFallbackProps) {
  const { status } = useAvatarContext("Avatar.Fallback");
  return (
    <span ref={ref} className={cx("fallback", className)} {...rest} hidden={status === "loaded"} />
  );
}
