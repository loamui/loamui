import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface DetailsRootProps extends PartProps<"details"> {
  /** Open by default (maps to the native open attribute). */
  defaultOpen?: boolean;
  /**
   * Share a name across several Details and the browser enforces
   * exclusivity natively: opening one closes the others. No wrapper
   * component is needed.
   */
  name?: string;
  children?: ReactNode;
}

/**
 * The native disclosure, styled and composed from parts:
 *
 * ```tsx
 * <Details.Root name="extras">
 *   <Details.Summary>Gift options</Details.Summary>
 *   <Details.Content>Add a gift message at checkout.</Details.Content>
 * </Details.Root>
 * ```
 *
 * `<details>/<summary>` with zero-JS toggling, find-in-page reveal, and
 * pre-hydration correctness.
 */
export function DetailsRoot({
  defaultOpen,
  name,
  className,
  children,
  ref,
  ...rest
}: DetailsRootProps) {
  return (
    <details
      ref={ref}
      className={cx("loam-Details", className)}
      name={name}
      open={defaultOpen}
      {...rest}
    >
      {children}
    </details>
  );
}
