"use client";

import { createContext, use, useEffect, useId, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { cx } from "../../utils.js";
import type { PartProps } from "../../utils.js";
import { composeRefs } from "../../render.js";
import { Button } from "../Button/Button.js";
import type { ButtonProps } from "../Button/Button.js";

/** The words the scroll region speaks. */
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
const TableContext = createContext(false);

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

/** The sort a column header carries: the three values of `aria-sort`. */
export type TableSortDirection = "ascending" | "descending" | "none";

const ThContext = createContext<TableSortDirection | null>(null);

export interface TableThProps extends PartProps<"th"> {
  /**
   * The column's current sort, emitted as `aria-sort`. `"none"` marks a
   * column that can be sorted but is not; leave it out for a header that
   * is not sortable at all.
   */
  sort?: TableSortDirection;
}

/**
 * A header cell. On its own it is a `<th scope="col">`; with `sort` it
 * carries `aria-sort`, and the `Table.SortButton` inside it reads the
 * value to say what a press will do. Belongs inside a `Table`, whose
 * stylesheet sets it.
 */
export function TableTh({ sort, scope = "col", className, children, ...rest }: TableThProps) {
  if (!use(TableContext)) {
    throw new Error("Table.Th must be rendered inside <Table.Root>.");
  }
  return (
    <ThContext value={sort ?? null}>
      <th aria-sort={sort} scope={scope} {...rest} className={className}>
        {children}
      </th>
    </ThContext>
  );
}

/** The words the SortButton speaks. */
export interface TableSortButtonLabels {
  /**
   * The hidden text after the column name that says what a press will do;
   * `column` is the children when they are text. @default `" sort ${next}"`
   */
  sort?: (column: string, next: TableSortDirection) => string;
}

export interface TableSortButtonProps extends ButtonProps {
  /**
   * Called with the sort a press asks for: `ascending` from `none` or
   * `descending`, `descending` from `ascending`. The consumer sorts the
   * rows and passes the result back as the `Table.Th`'s `sort`.
   */
  onSortChange?: (next: TableSortDirection) => void;
  /**
   * The words the button speaks: `sort(column, next)` is the hidden text
   * after the column name that says what a press will do (default
   * `" sort ascending"`; `column` is the children when they are text).
   */
  labels?: TableSortButtonLabels;
}

/**
 * The control in a sortable header: a LoamUI Button that toggles the
 * column's sort. Its visible label is the column name (its children); a
 * visually hidden suffix says what pressing will do, and the `Table.Th`
 * around it carries the current sort as `aria-sort`. The glyph is the
 * stylesheet's, keyed off that same attribute.
 */
export function TableSortButton({
  onSortChange,
  labels,
  onClick,
  className,
  children,
  ...rest
}: TableSortButtonProps) {
  const sort = use(ThContext);
  if (sort === null) {
    throw new Error("Table.SortButton must be rendered inside a <Table.Th sort>.");
  }
  const next: TableSortDirection = sort === "ascending" ? "descending" : "ascending";
  const sortLabel =
    labels?.sort ?? ((_column: string, direction: TableSortDirection) => ` sort ${direction}`);
  const column =
    typeof children === "string" || typeof children === "number" ? String(children) : "";

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) onSortChange?.(next);
  };

  return (
    <Button {...rest} className={cx("loam-Table-sort", className)} onClick={handleClick}>
      {children}
      <span className="loam-VisuallyHidden">{sortLabel(column, next)}</span>
    </Button>
  );
}
