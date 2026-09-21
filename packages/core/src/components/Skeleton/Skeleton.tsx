import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";

export interface SkeletonProps extends PartProps<"div"> {
  /** When false, render `children` instead of the placeholder. @default true */
  visible?: boolean;
  /** Real content: it sizes the placeholder, and shows once `visible` is false. */
  children?: ReactNode;
}

/**
 * A placeholder shown while content loads.
 *
 * Wrapped children size the box, so the placeholder mirrors the coming
 * layout with nothing declared (`<Skeleton><Avatar.Root /></Skeleton>` is a
 * circle of the avatar's size). A bare Skeleton is one text line, full
 * width; the public `--loam-skeleton-inline-size` and
 * `--loam-skeleton-block-size` properties size a bare placeholder from CSS
 * where the absent content cannot be measured. There are no size props.
 */
export function Skeleton({ visible = true, className, children, ref, ...rest }: SkeletonProps) {
  if (!visible) return <>{children}</>;

  return (
    <div ref={ref} className={cx("loam-Skeleton", className)} aria-hidden {...rest}>
      {children}
    </div>
  );
}
