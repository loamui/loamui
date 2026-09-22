"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { hasContent as hasMessageContent } from "../../../utils/content.js";
import { useIsoLayoutEffect } from "../../../hooks/use-id-registry.js";
import { useRadioGroupParts } from "../root/RadioGroupRootContext.js";

export interface RadioGroupErrorProps extends PartProps<"p"> {}

/**
 * The group's error, announced as it appears. Empty content renders nothing.
 * Validation state is supplied separately on Root.
 */
export function RadioGroupError({ id, className, children, ref, ...rest }: RadioGroupErrorProps) {
  const { errorId: defaultId, errorPrefix, registerError } = useRadioGroupParts("RadioGroup.Error");
  const errorId = id ?? defaultId;
  const hasContent = hasMessageContent(children);
  useIsoLayoutEffect(() => {
    if (hasContent) return registerError(errorId);
  }, [hasContent, errorId, registerError]);

  if (!hasContent) return null;
  return (
    <p ref={ref} className={cx("error", className)} id={errorId} role="alert" {...rest}>
      <span className="loam-VisuallyHidden">{errorPrefix}</span>
      {children}
    </p>
  );
}
