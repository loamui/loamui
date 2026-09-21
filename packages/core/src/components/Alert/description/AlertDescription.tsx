import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface AlertDescriptionProps extends PartProps<"div"> {}

export function AlertDescription({ className, children, ref, ...rest }: AlertDescriptionProps) {
  return (
    <div ref={ref} className={cx("description", className)} {...rest}>
      {children}
    </div>
  );
}
