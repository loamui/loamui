"use client";

import { useMemo, useState } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { AvatarContext } from "./AvatarRootContext.js";
import type { AvatarImageStatus } from "./AvatarRootContext.js";

export interface AvatarRootProps extends Omit<PartProps<"span">, "color"> {}

/** A person represented by an Image and explicit Fallback content. */
export function AvatarRoot({ className, children, ref, ...rest }: AvatarRootProps) {
  const [status, setStatus] = useState<AvatarImageStatus>("loading");
  const context = useMemo(() => ({ status, setStatus }), [status]);
  return (
    <AvatarContext value={context}>
      <span ref={ref} className={cx("loam-Avatar", className)} {...rest}>
        {children}
      </span>
    </AvatarContext>
  );
}
