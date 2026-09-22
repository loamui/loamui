"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { TableContext } from "./TableRootContext.js";

export interface TableLabels {
  /** The region's name when the table overflows and has no `<caption>`. @default "Scrollable table" */
  scrollable?: string;
}

export interface TableProps extends PartProps<"div"> {
  /** Shade alternating body rows. */
  striped?: boolean;
  /** Highlight the row under the pointer. */
  highlightOnHover?: boolean;
  /** Draw vertical borders between columns. */
  withColumnBorders?: boolean;
  /**
   * Keep the header row in view while the body scrolls beneath it. The
   * scroller is the component's own element: cap it with the public
   * `--loam-table-block-size` (or the layout around it) and the header
   * sticks to its top.
   */
  stickyHeader?: boolean;
  /** Attributes for the `<table>` itself (`ref` included). */
  tableProps?: PartProps<"table">;
  /**
   * The words the scroll region speaks: `scrollable` names it when the
   * table overflows and has no `<caption>` to take the name from.
   */
  labels?: TableLabels;
}

/**
 * A styled data table. Compose with native thead/tbody/tr/th/td inside it.
 *
 * The component's own element is the scroll wrapper: `className`, `ref` and
 * the rest land on it, and it becomes a focusable, labelled region only when
 * the table actually overflows, on either axis, so a page of narrow tables
 * adds no tab stops. The region takes its name from the table's own
 * `<caption>` when there is one. A `role`, `aria-label`, `aria-labelledby`
 * or `tabIndex` you pass always wins: the component fills in only what you
 * left out. The `<table>` inside takes `tableProps`. Cap the wrapper's
 * height with the public `--loam-table-block-size` and a long table scrolls
 * in place the same way; `stickyHeader` keeps the header row in view as it
 * does.
 *
 * A sortable column is `Table.Th` with a `sort` and a `Table.SortButton`
 * inside it; the consumer sorts the rows, the parts announce and style:
 *
 * ```tsx
 * <Table.Th sort={sort.column === "name" ? sort.direction : "none"}>
 *   <Table.SortButton onSortChange={(next) => setSort({ column: "name", direction: next })}>
 *     Name
 *   </Table.SortButton>
 * </Table.Th>
 * ```
 */

export function TableRoot({
  striped,
  highlightOnHover,
  withColumnBorders,
  stickyHeader,
  tableProps,
  labels,
  className,
  children,
  ref: refProp,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  tabIndex,
  ...rest
}: TableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, scrollRef), [refProp]);
  const captionId = useId();
  const [captionLabelledBy, setCaptionLabelledBy] = useState<string>();
  const [scrollable, setScrollable] = useState(false);
  const scrollableLabel = labels?.scrollable ?? "Scrollable table";

  // Overflow and the caption are facts of the rendered DOM, so they are
  // measured after render, not declared as props.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const caption = el.querySelector("caption");
    if (caption) {
      if (!caption.id) caption.id = captionId;
      setCaptionLabelledBy(caption.id);
    }
    const measure = () =>
      setScrollable(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [captionId]);

  const named = ariaLabel != null || ariaLabelledBy != null;
  const regionLabelledBy = scrollable && !named ? captionLabelledBy : undefined;
  const regionLabel = scrollable && !named && !captionLabelledBy ? scrollableLabel : undefined;

  return (
    <TableContext value>
      <div
        {...rest}
        ref={composedRef}
        className={cx("loam-Table", className)}
        role={role ?? (scrollable ? "region" : undefined)}
        aria-label={ariaLabel ?? regionLabel}
        aria-labelledby={ariaLabelledBy ?? regionLabelledBy}
        tabIndex={tabIndex ?? (scrollable ? 0 : undefined)}
        data-striped={striped || undefined}
        data-hover={highlightOnHover || undefined}
        data-col-borders={withColumnBorders || undefined}
        data-sticky-header={stickyHeader || undefined}
      >
        <table {...tableProps}>{children}</table>
      </div>
    </TableContext>
  );
}
