import type { PartProps } from "../../utils/props.js";
import { cx } from "../../utils/cx.js";
import type { LoamUISize } from "../../utils/props.js";

export interface LoaderProps extends Omit<PartProps<"span">, "color"> {
  /**
   * Overall size. When omitted the size comes from context: 1.5rem
   * standalone, or the composing component's answer (a Button sizes it at
   * 1em, like its icons). An explicit size is emitted as `data-size` and
   * wins over that context.
   */
  size?: LoamUISize;
  /** Accessible label announced to assistive tech. @default "Loading" */
  label?: string;
}

/**
 * An animated indicator for pending, indeterminate work.
 *
 * Coloured by the brand token, so a `--loam-context` region recolours it
 * with no prop; the parts draw with `currentColor`, so a plain `color:`
 * declaration on the loader (or an ancestor's channel) overrides.
 */
export function Loader({ size, label = "Loading", className, ref, ...rest }: LoaderProps) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cx("loam-Loader", className)}
      data-size={size}
      {...rest}
    >
      <span className="spinner" aria-hidden />
      <span className="loam-VisuallyHidden">{label}</span>
    </span>
  );
}
