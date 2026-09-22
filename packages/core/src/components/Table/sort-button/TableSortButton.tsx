"use client";

import { use } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { cx } from "../../../utils/cx.js";
import { Button } from "../../Button/Button.js";
import type { ButtonProps } from "../../Button/Button.js";
import { ThContext } from "../root/TableRootContext.js";
import type { TableSortDirection } from "../root/TableRootContext.js";

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
